import time
import unittest
from unittest.mock import patch

import app as app_module
from job_store import FileJobStore


class RouteTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        app_module.app.config.update(TESTING=True)
        cls.client = app_module.app.test_client()

    def test_health_check(self):
        response = self.client.get("/healthz")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"status": "ok"})

    def test_book_details_rejects_non_numeric_id(self):
        response = self.client.get("/book-details/not-an-id")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json()["error"], "Invalid book ID")

    def test_download_route_rejects_invalid_format(self):
        response = self.client.get("/download-book/42/wav")
        self.assertEqual(response.status_code, 400)

    def test_missing_job_does_not_expose_a_file(self):
        response = self.client.get("/fetch/missing/token")
        self.assertEqual(response.status_code, 404)

    def test_job_status_reads_job_written_by_another_worker(self):
        job_id = "12345678-1234-1234-1234-123456789012"
        other_worker = FileJobStore(app_module.JOBS.directory)
        now = time.time()
        other_worker[job_id] = {
            "status": "processing",
            "progress": 40,
            "message": "Downloaded 2/5",
            "created_at": now,
            "updated_at": now,
        }
        try:
            response = self.client.get(f"/job-status/{job_id}")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(
                response.get_json(),
                {
                    "status": "processing",
                    "progress": 40,
                    "message": "Downloaded 2/5",
                },
            )
        finally:
            app_module.JOBS.pop(job_id, None)

    def test_job_status_rejects_invalid_job_id(self):
        response = self.client.get("/job-status/not-a-uuid.json")
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json()["message"], "Job not found")

    def test_books_route_fetches_author_page_once(self):
        page = {
            "author_id": "7",
            "name": "Test Author",
            "bio": "Test biography.",
            "books": [
                {
                    "title": "Example Book",
                    "book_id": "42",
                    "links": {"epub": "https://flibusta.is/b/42/epub"},
                }
            ],
        }
        app_module.HTTP_CACHE.clear()

        try:
            with patch.object(app_module, "get_author_page", return_value=page) as get_page:
                response = self.client.get("/books/7?lang=ru")

            self.assertEqual(response.status_code, 200)
            get_page.assert_called_once_with("7")
            html = response.get_data(as_text=True)
            self.assertIn("Test Author", html)
            self.assertIn("Test biography.", html)
            self.assertIn("Example Book", html)
        finally:
            app_module.HTTP_CACHE.clear()

    def test_search_uses_primary_results_without_layout_fallback(self):
        primary = (
            [("Author", "1")],
            [{"book_id": "42", "title": "Book", "author_id": "1", "author_name": "Author"}],
        )
        with patch.object(app_module, "cached_catalog_search", return_value=primary) as search:
            response = self.client.post("/", data={"query": "Пушкин"})

        self.assertEqual(response.status_code, 200)
        search.assert_called_once_with("Пушкин")
        self.assertIn("Book", response.get_data(as_text=True))

    def test_search_tries_layout_fallback_only_when_primary_is_empty(self):
        primary = ([], [])
        fallback = ([("Author", "1")], [])
        with patch.object(
            app_module,
            "cached_catalog_search",
            side_effect=[primary, fallback],
        ) as search:
            response = self.client.post("/", data={"query": "ghbdtn"})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(search.call_count, 2)
        self.assertIn("Author", response.get_data(as_text=True))

    def test_search_survives_layout_fallback_failure(self):
        with patch.object(
            app_module,
            "cached_catalog_search",
            side_effect=[([], []), RuntimeError("upstream failed")],
        ):
            response = self.client.post("/", data={"query": "ghbdtn"})

        self.assertEqual(response.status_code, 200)
        self.assertIn("ghbdtn", response.get_data(as_text=True))

    def test_search_error_keeps_query_in_the_form(self):
        with patch.object(
            app_module,
            "cached_catalog_search",
            side_effect=RuntimeError("upstream failed"),
        ):
            response = self.client.post("/", data={"query": "Пушкин"})

        self.assertEqual(response.status_code, 200)
        self.assertIn('value="Пушкин"', response.get_data(as_text=True))

    def test_books_error_offers_a_retry_link(self):
        app_module.HTTP_CACHE.clear()
        with patch.object(
            app_module,
            "get_author_page",
            side_effect=RuntimeError("upstream failed"),
        ):
            response = self.client.get("/books/7?lang=ru")

        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        self.assertIn("Попробовать снова", html)
        self.assertIn("/books/7?lang=ru", html)
        app_module.HTTP_CACHE.clear()


if __name__ == "__main__":
    unittest.main()
