import hashlib
import json
import logging
import os
import threading
import time
from pathlib import Path

logger = logging.getLogger(__name__)

CACHE_VERSION = 1


class FileCache:
    """JSON cache shared by all Gunicorn workers on one host.

    Each entry is a small JSON file in a persistent directory. Writes are
    atomic, so one worker can read an entry written by another worker or by a
    previous process. A bounded in-memory layer keeps the hottest entries fast.
    """

    def __init__(
        self,
        directory,
        *,
        max_bytes=100 * 1024 * 1024,
        max_entries=1000,
        memory_entries=256,
    ):
        self.directory = Path(directory)
        self.directory.mkdir(parents=True, exist_ok=True, mode=0o700)
        try:
            os.chmod(self.directory, 0o700)
        except OSError:
            pass
        self.max_bytes = max_bytes
        self.max_entries = max_entries
        self.memory_entries = memory_entries
        self._lock = threading.RLock()
        self._memory = {}
        self._writes = 0

    def _path(self, key):
        digest = hashlib.sha256(str(key).encode("utf-8")).hexdigest()
        return self.directory / f"{digest}.json"

    def get(self, key, default=None):
        now = time.time()
        with self._lock:
            entry = self._memory.get(key)
            if entry:
                if entry.get("expires_at", 0) > now:
                    return entry.get("value")
                self._memory.pop(key, None)

        path = self._path(key)
        try:
            raw = path.read_text(encoding="utf-8")
        except FileNotFoundError:
            return default
        except OSError:
            logger.warning("Cache read failed for %s", path, exc_info=True)
            return default

        try:
            payload = json.loads(raw)
        except (OSError, ValueError):
            self._remove(path)
            return default

        if payload.get("version") != CACHE_VERSION or payload.get("key") != key:
            self._remove(path)
            return default
        if payload.get("expires_at", 0) <= now:
            self._remove(path)
            return default

        with self._lock:
            self._remember(key, payload)
        return payload.get("value")

    def set(self, key, value, ttl):
        now = time.time()
        payload = {
            "version": CACHE_VERSION,
            "key": key,
            "created_at": now,
            "expires_at": now + ttl,
            "value": value,
        }
        try:
            encoded = json.dumps(payload, ensure_ascii=False)
        except (TypeError, ValueError):
            logger.warning("Cache value for %r is not JSON serializable", key)
            return False

        path = self._path(key)
        temporary_path = path.with_name(
            f".{path.name}.{os.getpid()}.{threading.get_ident()}.tmp"
        )
        with self._lock:
            try:
                temporary_path.write_text(encoded, encoding="utf-8")
                os.replace(temporary_path, path)
            except OSError:
                logger.warning("Cache write failed for %s", path, exc_info=True)
                return False
            self._remember(key, payload)
            self._writes += 1
            should_prune = self._writes % 25 == 0

        if should_prune:
            self.prune()
        return True

    def _remember(self, key, payload):
        self._memory[key] = payload
        while len(self._memory) > self.memory_entries:
            self._memory.pop(next(iter(self._memory)))

    def prune(self):
        with self._lock:
            self._memory.clear()
            entries = []
            total = 0
            for path in self.directory.glob("*.json"):
                try:
                    stat = path.stat()
                except OSError:
                    continue
                entries.append((stat.st_mtime, stat.st_size, path))
                total += stat.st_size

            entries.sort(key=lambda item: item[0])
            while entries and (len(entries) > self.max_entries or total > self.max_bytes):
                _, size, path = entries.pop(0)
                total -= size
                self._remove(path)

    def clear(self):
        with self._lock:
            self._memory.clear()
            for path in self.directory.glob("*.json"):
                self._remove(path)

    @staticmethod
    def _remove(path):
        try:
            path.unlink(missing_ok=True)
        except OSError:
            pass
