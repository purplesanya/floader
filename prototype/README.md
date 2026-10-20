# FLoader — design prototype

A separate, local-only design direction for FLoader. It keeps the Flibusta-like blue accent and the familiar book-search flow, but moves to a warmer paper background, a search-first layout, and simple rows instead of nested cards.

This is **not** the production app. It uses mock data and does not download files.

## Run it

From the project root:

```powershell
python -m http.server 5100 --directory prototype
```

Open:

```text
http://127.0.0.1:5100/
```

The prototype is phone-first. Check it at 390px first, then widen to desktop.

## Design decisions

- **Search is the first and main action.** The oversized marketing hero and side card are gone. The search field is the focus.
- **One column, one panel.** Results, recommendations, and author books use one white panel with hairline-separated rows instead of cards inside cards.
- **Less navigation.** The header only keeps the brand and language label. Recommendations and Bookmarks live in the footer.
- **Direct download choices.** EPUB, FB2, and MOBI are visible on each book row. PDF/DOCX are intentionally left out of this simpler prototype.
- **Descriptions are optional.** “Подробнее” uses native `<details>` and expands inline; there is no modal.
- **Large controls.** Inputs and buttons are 44–54px tall, body text is 17px, and mobile book cards keep the actions in one row.
- **Recommendations are shorter.** Six books are shown first; “Показать ещё” reveals more instead of an 80-card wall.
- **Bookmarks work.** They are stored in `localStorage`, with a simple empty state and saved-books list.
- **No page-load fade.** Content is readable immediately.

## Palette

The palette is deliberately close to the current app, but warmer:

```text
background   #f3eee4   warm paper
surface      #fffdf8   card / panel
text         #1d2730   near-black
muted        #5d6b76   secondary text
accent       #2c5f9e   Flibusta-like blue
accent soft  #e8eef6   active / selected
border       #d9d1c1   hairlines
control      #8f8370   input and button boundaries
```

Golos Text is self-hosted in `fonts/` (SIL Open Font License, see `fonts/OFL.txt`).

## Files

```text
prototype/
  index.html    static view containers
  styles.css    warm paper palette, phone-first layout
  app.js        mock data, hash routing, search, author selection, bookmarks, demo toast
  fonts/        Golos Text woff2 files and OFL license
  favicon.*     local icon
  README.md
```

## What is mocked

- 18 books, 5 authors, and 8 recommendations.
- Search filters the mock catalog by title or author.
- EPUB/FB2/MOBI buttons show a demo toast instead of downloading.
- Bookmarks persist in the browser's `localStorage`.
- The language label is static `RU`; English is out of scope for this prototype.

## What to compare

At 390px wide, compare with the current app:

1. Time to understand the main action.
2. Number of decisions before a download.
3. Number of stacked cards and panels.
4. Readability of titles, authors, and format controls.
5. Comfort when scrolling an author library.
