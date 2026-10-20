import tempfile
import unittest
from pathlib import Path

from job_store import FileJobStore


class FileJobStoreTests(unittest.TestCase):
    def test_jobs_are_visible_to_another_store_instance(self):
        with tempfile.TemporaryDirectory() as directory:
            worker_a = FileJobStore(Path(directory))
            worker_b = FileJobStore(Path(directory))

            worker_a["job-1"] = {"status": "pending", "progress": 0}

            self.assertEqual(
                worker_b.get("job-1"),
                {"status": "pending", "progress": 0},
            )

            worker_b["job-1"] = {"status": "processing", "progress": 50}

            self.assertEqual(
                worker_a.get("job-1"),
                {"status": "processing", "progress": 50},
            )

    def test_pop_removes_job_for_every_instance(self):
        with tempfile.TemporaryDirectory() as directory:
            worker_a = FileJobStore(Path(directory))
            worker_b = FileJobStore(Path(directory))
            worker_a["job-2"] = {"status": "complete"}

            self.assertEqual(worker_b.pop("job-2"), {"status": "complete"})
            self.assertIsNone(worker_a.get("job-2"))

    def test_invalid_job_ids_are_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            store = FileJobStore(Path(directory))

            with self.assertRaises(KeyError):
                store["../../outside"]

            self.assertIsNone(store.get("../outside"))


if __name__ == "__main__":
    unittest.main()
