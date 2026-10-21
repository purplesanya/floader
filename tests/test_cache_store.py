import tempfile
import time
import unittest
from pathlib import Path

from cache_store import FileCache


class FileCacheTests(unittest.TestCase):
    def test_entries_are_shared_between_instances(self):
        with tempfile.TemporaryDirectory() as directory:
            worker_a = FileCache(Path(directory))
            worker_b = FileCache(Path(directory))

            worker_a.set("book:42", {"title": "Example"}, ttl=60)

            self.assertEqual(worker_b.get("book:42"), {"title": "Example"})

    def test_expired_entries_are_not_returned(self):
        with tempfile.TemporaryDirectory() as directory:
            cache = FileCache(Path(directory))
            cache.set("book:42", {"title": "Example"}, ttl=0.01)
            time.sleep(0.05)

            self.assertIsNone(cache.get("book:42"))

    def test_corrupt_entries_are_ignored(self):
        with tempfile.TemporaryDirectory() as directory:
            cache = FileCache(Path(directory))
            cache.set("book:42", {"title": "Example"}, ttl=60)
            cache._path("book:42").write_text("not-json", encoding="utf-8")

            fresh_reader = FileCache(Path(directory))
            self.assertIsNone(fresh_reader.get("book:42"))

    def test_prune_respects_max_entries(self):
        with tempfile.TemporaryDirectory() as directory:
            cache = FileCache(Path(directory), max_entries=2)
            cache.set("a", {"value": 1}, ttl=60)
            cache.set("b", {"value": 2}, ttl=60)
            cache.set("c", {"value": 3}, ttl=60)

            cache.prune()

            self.assertLessEqual(len(list(Path(directory).glob("*.json"))), 2)

    def test_unicode_keys_work(self):
        with tempfile.TemporaryDirectory() as directory:
            cache = FileCache(Path(directory))
            cache.set("catalog_search:пушкин", ["author"], ttl=60)

            self.assertEqual(cache.get("catalog_search:пушкин"), ["author"])


if __name__ == "__main__":
    unittest.main()
