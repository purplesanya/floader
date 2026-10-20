import json
import os
import re
import threading
from pathlib import Path

_JOB_ID_RE = re.compile(r"^[A-Za-z0-9_-]{1,64}$")


class FileJobStore:
    """Job registry shared by every Gunicorn worker on the same host.

    Each job is stored as its own JSON file in a directory under the OS temp
    directory. Writes are atomic (temp file plus os.replace), so a job created
    by one worker is immediately readable by all the others.
    """

    def __init__(self, directory):
        self.directory = Path(directory)
        self.directory.mkdir(parents=True, exist_ok=True, mode=0o700)
        try:
            os.chmod(self.directory, 0o700)
        except OSError:
            pass
        self._lock = threading.RLock()

    @staticmethod
    def _validate_key(key):
        key = str(key)
        if not _JOB_ID_RE.match(key):
            raise KeyError(key)
        return key

    def _path(self, key):
        return self.directory / f"{self._validate_key(key)}.json"

    def get(self, key, default=None):
        try:
            return self[key]
        except KeyError:
            return default

    def __getitem__(self, key):
        path = self._path(key)
        try:
            raw = path.read_text(encoding="utf-8")
        except FileNotFoundError:
            raise KeyError(key) from None
        try:
            return json.loads(raw)
        except (OSError, ValueError):
            raise KeyError(key) from None

    def __setitem__(self, key, value):
        path = self._path(key)
        temporary_path = path.with_name(
            f".{path.name}.{os.getpid()}.{threading.get_ident()}.tmp"
        )
        with self._lock:
            temporary_path.write_text(
                json.dumps(value, ensure_ascii=False),
                encoding="utf-8",
            )
            try:
                os.chmod(temporary_path, 0o600)
            except OSError:
                pass
            os.replace(temporary_path, path)

    def pop(self, key, default=None):
        with self._lock:
            try:
                value = self[key]
            except KeyError:
                return default
            try:
                self._path(key).unlink()
            except FileNotFoundError:
                pass
            return value

    def items(self):
        jobs = []
        for path in self.directory.glob("*.json"):
            try:
                jobs.append((path.stem, self[path.stem]))
            except KeyError:
                continue
        return jobs

    def __len__(self):
        return len(list(self.directory.glob("*.json")))
