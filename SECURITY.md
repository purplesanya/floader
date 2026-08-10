# Security Policy

- Never commit `.env` files, cookies, credentials, databases, downloaded books, or logs.
- Keep Flask debug mode disabled outside local development.
- Keep the application bound to localhost unless a trusted reverse proxy is configured.
- Do not expose temporary download paths or reuse download tokens outside their intended job.
- Report suspected vulnerabilities privately through the contact method configured on the repository owner's Git hosting account.
