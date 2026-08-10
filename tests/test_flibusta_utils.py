import unittest

from bs4 import BeautifulSoup

from flibusta_utils import (
    _book_details_from_soup,
    _extract_book_id,
    sanitize_filename,
    validate_download_link,
)


class LinkValidationTests(unittest.TestCase):
    def test_accepts_supported_book_download_paths(self):
        self.assertTrue(validate_download_link("https://flibusta.is/b/42/epub", "epub"))
        self.assertTrue(validate_download_link("https://flibusta.is/b/42/download", "pdf"))

    def test_rejects_lookalike_hosts_and_invalid_ids(self):
        self.assertFalse(validate_download_link("https://flibusta.is.example/b/42/epub", "epub"))
        self.assertFalse(validate_download_link("https://flibusta.is/b/not-a-number/epub", "epub"))
        self.assertFalse(validate_download_link("https://flibusta.is/b/42/epub", "wav"))


class ParserTests(unittest.TestCase):
    def test_extracts_book_id_from_supported_path(self):
        self.assertEqual(_extract_book_id("/b/42/epub"), "42")
        self.assertIsNone(_extract_book_id("/books/42"))

    def test_extracts_book_details_and_download_links(self):
        soup = BeautifulSoup(
            """
            <main>
              <h1 class="title">Example Book</h1>
              <a href="/a/7">Example Author</a>
              <h2>Description</h2>
              <p>This is a sufficiently long description for a parser fixture.</p>
              <a href="/b/42/epub">EPUB</a>
              <a href="/b/42/download">PDF</a>
            </main>
            """,
            "html.parser",
        )

        details = _book_details_from_soup(soup, "42", "https://flibusta.is/b/42")

        self.assertEqual(details["title"], "Example Book")
        self.assertEqual(details["author_id"], "7")
        self.assertEqual(details["links"]["epub"], "https://flibusta.is/b/42/epub")
        self.assertEqual(details["links"]["pdf"], "https://flibusta.is/b/42/download")

    def test_sanitizes_filenames(self):
        self.assertEqual(sanitize_filename('Book: "Chapter"?.epub'), "Book_ _Chapter__.epub")
        self.assertEqual(sanitize_filename("..."), "untitled")


if __name__ == "__main__":
    unittest.main()
