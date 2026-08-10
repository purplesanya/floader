# FLoader

FLoader is a Flask web application for searching an online book catalog, browsing author libraries, selecting supported formats, and preparing single-file or ZIP downloads. It includes bilingual English/Russian UI, keyboard-layout-tolerant search, short-lived caching, local browser bookmarks, recommendations, and background job progress.

> Portfolio note: use this application only with public-domain or otherwise authorized material. The repository contains no downloaded books, credentials, cookies, databases, or deployment secrets.

## Features

- Search authors and books through a single responsive UI.
- Handle common Russian/English keyboard-layout mistakes.
- Parse author pages, book details, descriptions, biographies, and recommendations.
- Validate download URLs against the expected host, path, book ID, and format.
- Download one book directly or bundle several books into a temporary ZIP archive.
- Track background jobs with progress, expiring tokens, and temp-file cleanup.
- Keep bookmarks in the browser instead of requiring an account.
- Serve English or Russian translations based on an explicit preference or browser language.
- Expose a health endpoint suitable for Render or another hosting platform.

## Architecture

```text
app.py                  Flask routes, caching, language selection, and job lifecycle
flibusta_utils.py       HTML parsing, URL validation, downloads, and archive creation
static/                 Responsive CSS, JavaScript, and branding
tests/                  Offline parser and route tests using synthetic HTML
```

The scraper is intentionally rate-limited and uses retries for transient upstream failures. Runtime downloads are written to the operating system temp directory and are removed after the job expires.

## Quick Start

Requires Python 3.11 or newer.

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python app.py
```

Open `http://127.0.0.1:5000`.

Configuration is provided through environment variables:

- `PORT` changes the listening port.
- `FLASK_RUN_HOST` changes the bind address; keep the local default for development.
- `FLASK_DEBUG=1` enables Flask debug mode for local development only.
- `LOG_LEVEL` controls application logging.

## Tests

The test suite does not contact the upstream website:

```powershell
python -m unittest discover -s tests -p "test_*.py"
python -m compileall -q .
```

The CI workflow runs these checks on Python 3.11 and 3.12.

## Deployment

`Procfile` and `render.yaml` provide a generic Gunicorn/Render deployment path. The app is stateless apart from short-lived temp files and in-browser bookmarks, so no database service is required.

## Responsible Use

The application is a demonstration of parsing, validation, caching, background work, and a responsive Flask UI. Respect copyright, terms of service, rate limits, and access controls. Do not use it to bypass authentication or download material you are not authorized to access.

## License

Released under the MIT License. See `LICENSE`.
