import unittest
from unittest.mock import patch

from bs4 import BeautifulSoup

from flibusta_utils import (
    _book_details_from_soup,
    _books_from_author_soup,
    _extract_book_id,
    _parse_search_authors,
    _parse_search_books,
    sanitize_filename,
    search_books,
    search_catalog,
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

    def test_parses_search_results_without_fetching_book_pages(self):
        soup = BeautifulSoup(
            """
            <main>
              <h3>Найденные книги</h3>
              <ul>
                <li><a href="/b/42">Book 42</a> — <a href="/a/7">Author 7</a></li>
                <li><a href="/b/43/epub">Book 43</a> — <a href="/a/8">Author 8</a></li>
              </ul>
            </main>
            """,
            "html.parser",
        )

        with patch("flibusta_utils._get_soup", return_value=soup), patch(
            "flibusta_utils.get_book_details"
        ) as details:
            books = search_books("query")

        self.assertEqual([book["book_id"] for book in books], ["42", "43"])
        self.assertEqual(books[0]["author_id"], "7")
        self.assertEqual(books[1]["author_name"], "Author 8")
        details.assert_not_called()

    def test_search_results_can_be_limited(self):
        soup = BeautifulSoup(
            """
            <main>
              <h3>Найденные книги</h3>
              <ul>
                <li><a href="/b/42">Book 42</a></li>
                <li><a href="/b/43">Book 43</a></li>
              </ul>
            </main>
            """,
            "html.parser",
        )

        books = _parse_search_books(soup, limit=1)
        self.assertEqual(len(books), 1)
        self.assertEqual(books[0]["book_id"], "42")

    def test_search_authors_can_be_limited(self):
        soup = BeautifulSoup(
            """
            <main>
              <h3>Найденные писатели</h3>
              <ul>
                <li><a href="/a/1">Author 1</a></li>
                <li><a href="/a/2">Author 2</a></li>
                <li><a href="/a/3">Author 3</a></li>
              </ul>
            </main>
            """,
            "html.parser",
        )

        authors = _parse_search_authors(soup, limit=2)
        self.assertEqual(authors, [("Author 1", "1"), ("Author 2", "2")])

    def test_catalog_search_parses_authors_and_books_from_one_request(self):
        soup = BeautifulSoup(
            """
            <main>
              <h3>Найденные писатели</h3>
              <ul>
                <li><a href="/a/7">Author 7</a></li>
              </ul>
              <h3>Найденные книги</h3>
              <ul>
                <li><a href="/b/42">Book 42</a> — <a href="/a/7">Author 7</a></li>
              </ul>
            </main>
            """,
            "html.parser",
        )

        with patch("flibusta_utils._get_soup", return_value=soup) as get_soup:
            authors, books = search_catalog("query")

        self.assertEqual(authors, [("Author 7", "7")])
        self.assertEqual([book["book_id"] for book in books], ["42"])
        get_soup.assert_called_once()

    def test_extracts_author_page_books_with_download_links(self):
        soup = BeautifulSoup(
            """
            <main>
              <h1 class="title">Example Author</h1>
              <h2>Биография</h2>
              <p>Author biography.</p>
              <div>
                <a href="/b/42">Book 42</a>
                <a href="/b/42/epub">EPUB</a>
                <a href="/b/42/download">PDF</a>
              </div>
              <div>
                <a href="/b/43">Book 43</a>
                <a href="/b/43/fb2">FB2</a>
              </div>
            </main>
            """,
            "html.parser",
        )

        books = _books_from_author_soup(soup, "7")

        self.assertEqual([book["book_id"] for book in books], ["42", "43"])
        self.assertEqual(books[0]["links"]["epub"], "https://flibusta.is/b/42/epub")
        self.assertEqual(books[0]["links"]["pdf"], "https://flibusta.is/b/42/download")
        self.assertEqual(books[1]["links"]["fb2"], "https://flibusta.is/b/43/fb2")


if __name__ == "__main__":
    unittest.main()
