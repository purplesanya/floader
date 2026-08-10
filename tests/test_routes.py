import unittest

import app as app_module


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


if __name__ == "__main__":
    unittest.main()
