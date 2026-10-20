const BOOKMARKS_KEY = "flibustaBookmarks";
const bookmarkRoot = document.querySelector(".bookmark-root");
const bookmarkContent = document.getElementById("bookmarkContent");

function bookmarkText(key) {
  return bookmarkRoot?.dataset[key] || "";
}

function readBookmarks() {
  try {
    const parsed = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writeBookmarks(bookmarks) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}

function bookmarkFromButton(button) {
  return {
    bookId: button.dataset.bookId || "",
    title: button.dataset.title || "",
    author: button.dataset.author || "",
    authorId: button.dataset.authorId || "",
    url: button.dataset.url || "",
    savedAt: new Date().toISOString(),
  };
}

function setButtonState(button, isBookmarked) {
  button.classList.toggle("saved", isBookmarked);
  button.setAttribute("aria-pressed", isBookmarked ? "true" : "false");
  if (isBookmarked && button.hasAttribute("data-bookmark-remove")) {
    button.textContent = bookmarkText("removeBookmark");
  } else {
    button.textContent = isBookmarked ? bookmarkText("bookmarked") : bookmarkText("bookmark");
  }
}

function refreshBookmarkButtons() {
  const savedIds = new Set(readBookmarks().map((bookmark) => bookmark.bookId));
  document.querySelectorAll("[data-bookmark-toggle]").forEach((button) => {
    setButtonState(button, savedIds.has(button.dataset.bookId || ""));
  });
}

function toggleBookmark(button) {
  const bookmark = bookmarkFromButton(button);
  if (!bookmark.bookId || !bookmark.title) return;

  const bookmarks = readBookmarks();
  const existingIndex = bookmarks.findIndex((item) => item.bookId === bookmark.bookId);
  if (existingIndex >= 0) {
    bookmarks.splice(existingIndex, 1);
  } else {
    bookmarks.unshift(bookmark);
  }
  writeBookmarks(bookmarks);
  refreshBookmarkButtons();
  renderBookmarkPage();
}

function buildBookmarkRow(bookmark) {
  const article = document.createElement("article");
  article.className = "row book-row";
  article.dataset.detailCard = "";
  article.dataset.bookId = bookmark.bookId;

  const main = document.createElement("div");
  main.className = "book-main";

  const title = document.createElement("h3");
  title.textContent = bookmark.title;
  main.appendChild(title);

  if (bookmark.authorId) {
    const author = document.createElement("a");
    author.className = "byline muted-link";
    author.href = `/books/${encodeURIComponent(bookmark.authorId)}?lang=${document.documentElement.lang || "en"}`;
    author.textContent = bookmark.author || bookmarkText("unknownAuthor");
    main.appendChild(author);
  } else {
    const author = document.createElement("p");
    author.className = "byline";
    author.textContent = bookmark.author || bookmarkText("unknownAuthor");
    main.appendChild(author);
  }

  const details = document.createElement("details");
  details.className = "details";
  const summary = document.createElement("summary");
  summary.textContent = bookmarkText("details");
  const description = document.createElement("p");
  description.className = "book-description";
  description.dataset.bookId = bookmark.bookId;
  description.textContent = bookmarkText("loadingDescription");
  details.append(summary, description);
  main.appendChild(details);

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "text-link bookmark-toggle saved";
  removeButton.dataset.bookmarkToggle = "";
  removeButton.dataset.bookmarkRemove = "";
  removeButton.dataset.bookId = bookmark.bookId;
  removeButton.dataset.title = bookmark.title;
  removeButton.dataset.author = bookmark.author || "";
  removeButton.dataset.authorId = bookmark.authorId || "";
  removeButton.dataset.url = bookmark.url || "";
  removeButton.setAttribute("aria-pressed", "true");
  removeButton.textContent = bookmarkText("removeBookmark");
  main.appendChild(removeButton);

  const actions = document.createElement("div");
  actions.className = "row-actions";

  const label = document.createElement("span");
  label.className = "action-label";
  label.textContent = bookmarkText("downloadFormats");

  const downloads = document.createElement("div");
  downloads.className = "inline-downloads";
  downloads.dataset.bookId = bookmark.bookId;
  downloads.dataset.title = bookmark.title;
  const loading = document.createElement("span");
  loading.className = "download-loading";
  loading.textContent = bookmarkText("loadingFormats");
  downloads.appendChild(loading);

  actions.append(label, downloads);
  article.append(main, actions);
  return article;
}

function renderBookmarkPage() {
  if (!bookmarkContent) return;

  const bookmarks = readBookmarks();
  bookmarkContent.replaceChildren();

  if (!bookmarks.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    const title = document.createElement("p");
    title.className = "empty-title";
    title.textContent = bookmarkText("noBookmarks");
    const hint = document.createElement("p");
    hint.textContent = bookmarkText("noBookmarksHint");
    const link = document.createElement("a");
    link.className = "button button-secondary";
    link.href = `/?lang=${document.documentElement.lang || "en"}`;
    link.textContent = bookmarkText("backToSearch");
    empty.append(title, hint, link);
    bookmarkContent.appendChild(empty);
    document.dispatchEvent(new CustomEvent("bookmarks:updated"));
    return;
  }

  const section = document.createElement("section");
  section.setAttribute("aria-labelledby", "saved-books-title");

  const heading = document.createElement("div");
  heading.className = "section-heading";
  const headingTitle = document.createElement("h2");
  headingTitle.id = "saved-books-title";
  headingTitle.textContent = bookmarkText("savedBooks");
  const count = document.createElement("span");
  count.className = "count";
  count.textContent = String(bookmarks.length);
  heading.append(headingTitle, count);

  const panel = document.createElement("div");
  panel.className = "panel";
  panel.append(...bookmarks.map(buildBookmarkRow));

  section.append(heading, panel);
  bookmarkContent.appendChild(section);
  document.dispatchEvent(new CustomEvent("bookmarks:updated"));
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-bookmark-toggle]");
  if (!button) return;
  event.preventDefault();
  event.stopPropagation();
  toggleBookmark(button);
});

refreshBookmarkButtons();
renderBookmarkPage();
