const FORMAT_ORDER = ["epub", "fb2", "mobi"];
const BOOKMARK_KEY = "floader-prototype-bookmarks";

const AUTHORS = [
  { id: "pushkin", name: "Александр Сергеевич Пушкин" },
  { id: "bulgakov", name: "Михаил Афанасьевич Булгаков" },
  { id: "strugatsky", name: "Аркадий и Борис Стругацкие" },
  { id: "dostoevsky", name: "Фёдор Михайлович Достоевский" },
  { id: "orwell", name: "Джордж Оруэлл" },
];

const BOOKS = [
  {
    id: "master",
    title: "Мастер и Маргарита",
    authorId: "bulgakov",
    author: "Михаил Афанасьевич Булгаков",
    formats: ["epub", "fb2", "mobi"],
    description: "Роман о Москве 1930-х, любви и выборе, который приходится делать вопреки страху.",
  },
  {
    id: "white-guard",
    title: "Белая гвардия",
    authorId: "bulgakov",
    author: "Михаил Афанасьевич Булгаков",
    formats: ["epub", "fb2", "mobi"],
    description: "Семейная хроника о Киеве времён Гражданской войны и о том, как дом пытается устоять.",
  },
  {
    id: "dog-heart",
    title: "Собачье сердце",
    authorId: "bulgakov",
    author: "Михаил Афанасьевич Булгаков",
    formats: ["epub", "fb2", "mobi"],
    description: "История профессора, который решил улучшить природу — и получил неожиданный результат.",
  },
  {
    id: "theatre",
    title: "Театральный роман",
    authorId: "bulgakov",
    author: "Михаил Афанасьевич Булгаков",
    formats: ["epub", "fb2"],
    description: "Короткий роман о закулисье театра, написанный с мягкой иронией.",
  },
  {
    id: "onegin",
    title: "Евгений Онегин",
    authorId: "pushkin",
    author: "Александр Сергеевич Пушкин",
    formats: ["epub", "fb2", "mobi"],
    description: "Роман в стихах о дружбе, любви и опоздании, которое уже нельзя исправить.",
  },
  {
    id: "captain",
    title: "Капитанская дочка",
    authorId: "pushkin",
    author: "Александр Сергеевич Пушкин",
    formats: ["epub", "fb2", "mobi"],
    description: "История о чести и взрослении в пугачёвскую эпоху.",
  },
  {
    id: "belkin",
    title: "Повести Белкина",
    authorId: "pushkin",
    author: "Александр Сергеевич Пушкин",
    formats: ["epub", "fb2"],
    description: "Пять небольших историй с неожиданными развязками.",
  },
  {
    id: "dubrovsky",
    title: "Дубровский",
    authorId: "pushkin",
    author: "Александр Сергеевич Пушкин",
    formats: ["epub", "fb2", "mobi"],
    description: "История о любви и мести, где благородный разбойник оказывается не тем, кем кажется.",
  },
  {
    id: "roadside",
    title: "Пикник на обочине",
    authorId: "strugatsky",
    author: "Аркадий и Борис Стругацкие",
    formats: ["epub", "fb2", "mobi"],
    description: "Фантастическая повесть о человеке, который столкнулся с чужой цивилизацией.",
  },
  {
    id: "monday",
    title: "Понедельник начинается в субботу",
    authorId: "strugatsky",
    author: "Аркадий и Борис Стругацкие",
    formats: ["epub", "fb2", "mobi"],
    description: "Сказка для взрослых о научном институте, где чудеса — обычная работа.",
  },
  {
    id: "hard",
    title: "Трудно быть богом",
    authorId: "strugatsky",
    author: "Аркадий и Борис Стругацкие",
    formats: ["epub", "fb2"],
    description: "История о прогрессоре, который пытается изменить чужой мир.",
  },
  {
    id: "snail",
    title: "Улитка на склоне",
    authorId: "strugatsky",
    author: "Аркадий и Борис Стругацкие",
    formats: ["epub", "fb2", "mobi"],
    description: "Сюрреалистическая повесть о лесе, который не хочет отпускать людей.",
  },
  {
    id: "crime",
    title: "Преступление и наказание",
    authorId: "dostoevsky",
    author: "Фёдор Михайлович Достоевский",
    formats: ["epub", "fb2", "mobi"],
    description: "История о преступлении, совести и невозможности вернуться назад.",
  },
  {
    id: "idiot",
    title: "Идиот",
    authorId: "dostoevsky",
    author: "Фёдор Михайлович Достоевский",
    formats: ["epub", "fb2"],
    description: "Роман о человеке, который слишком хорошо думает о других.",
  },
  {
    id: "brothers",
    title: "Братья Карамазовы",
    authorId: "dostoevsky",
    author: "Фёдор Михайлович Достоевский",
    formats: ["epub", "fb2", "mobi"],
    description: "Семейная драма о вере, деньгах и вине.",
  },
  {
    id: "notes",
    title: "Записки из подполья",
    authorId: "dostoevsky",
    author: "Фёдор Михайлович Достоевский",
    formats: ["epub", "fb2"],
    description: "Короткий роман о человеке, который спорит с миром и с собой.",
  },
  {
    id: "1984",
    title: "1984",
    authorId: "orwell",
    author: "Джордж Оруэлл",
    formats: ["epub", "fb2", "mobi"],
    description: "Антиутопия о мире, где за человеком следят даже его собственные мысли.",
  },
  {
    id: "animal-farm",
    title: "Скотный двор",
    authorId: "orwell",
    author: "Джордж Оруэлл",
    formats: ["epub", "fb2", "mobi"],
    description: "Сказка о ферме, где животные решили построить справедливое общество.",
  },
];

const RECOMMENDATION_IDS = ["master", "onegin", "roadside", "crime", "1984", "monday", "white-guard", "idiot"];

const views = {
  search: document.getElementById("view-search"),
  results: document.getElementById("view-results"),
  author: document.getElementById("view-author"),
  recommendations: document.getElementById("view-recommendations"),
  bookmarks: document.getElementById("view-bookmarks"),
};

const titles = {
  search: "FLoader — поиск книг",
  results: "Результаты — FLoader",
  author: "Книги автора — FLoader",
  recommendations: "Рекомендации — FLoader",
  bookmarks: "Закладки — FLoader",
};

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resultsTitle = document.getElementById("results-title");
const resultsLead = document.getElementById("results-lead");
const resultsContent = document.getElementById("results-content");
const authorTitle = document.getElementById("author-title");
const authorLead = document.getElementById("author-lead");
const authorFilter = document.getElementById("author-filter");
const authorFormats = document.getElementById("author-formats");
const authorBooks = document.getElementById("author-books");
const selectedCount = document.getElementById("selected-count");
const selectedFormat = document.getElementById("selected-format");
const downloadButton = document.getElementById("download-button");
const recommendationsList = document.getElementById("recommendations-list");
const showMoreRecs = document.getElementById("show-more-recs");
const bookmarksContent = document.getElementById("bookmarks-content");
const toast = document.getElementById("toast");

const state = {
  lastQuery: "",
  query: "",
  authorId: null,
  format: "epub",
  filter: "",
  selected: new Set(),
  recsVisible: 6,
};

let bookmarks = loadBookmarks();
let toastTimer = 0;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return entities[character];
  });
}

function plural(count, one, few, many) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

function bookWord(count) {
  return `${count} ${plural(count, "книга", "книги", "книг")}`;
}

function authorWord(count) {
  return `${count} ${plural(count, "автор", "автора", "авторов")}`;
}

function bookById(id) {
  return BOOKS.find((book) => book.id === id);
}

function booksByAuthor(authorId) {
  return BOOKS.filter((book) => book.authorId === authorId);
}

function authorById(id) {
  return AUTHORS.find((author) => author.id === id);
}

function loadBookmarks() {
  try {
    const stored = JSON.parse(localStorage.getItem(BOOKMARK_KEY) || "[]");
    if (!Array.isArray(stored)) return new Set();
    return new Set(stored.filter((id) => bookById(id)));
  } catch (error) {
    return new Set();
  }
}

function saveBookmarks() {
  try {
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify([...bookmarks]));
  } catch (error) {
    // The prototype still works without storage.
  }
}

function formatButtons(book) {
  return book.formats
    .map(
      (format) =>
        `<button type="button" class="format-button" data-download-format="${format}" data-book-id="${book.id}" aria-label="Скачать ${escapeHtml(book.title)} в формате ${format.toUpperCase()}">${format.toUpperCase()}</button>`,
    )
    .join("");
}

function bookmarkButton(book) {
  const saved = bookmarks.has(book.id);
  return `<button type="button" class="text-link bookmark-toggle" data-bookmark="${book.id}" aria-pressed="${saved}">${saved ? "В закладках" : "В закладки"}</button>`;
}

function bookRow(book) {
  return `<article class="row">
    <div class="book-main">
      <h3>${escapeHtml(book.title)}</h3>
      <p class="byline">${escapeHtml(book.author)}</p>
      <details class="details">
        <summary>Подробнее</summary>
        <p>${escapeHtml(book.description)}</p>
      </details>
      ${bookmarkButton(book)}
    </div>
    <div class="row-actions">
      <span class="action-label">Скачать</span>
      <div class="formats">${formatButtons(book)}</div>
    </div>
  </article>`;
}

function authorRow(author) {
  const count = booksByAuthor(author.id).length;
  return `<a class="author-row" href="#/author/${author.id}">
    <span>
      <span class="author-name">${escapeHtml(author.name)}</span>
      <span class="author-meta">${bookWord(count)}</span>
    </span>
    <span class="row-arrow" aria-hidden="true">→</span>
  </a>`;
}

function authorBookRow(book) {
  const checked = state.selected.has(book.id);
  return `<article class="row author-book${checked ? " is-selected" : ""}">
    <input class="book-checkbox" type="checkbox" id="book-${book.id}" data-select="${book.id}" ${checked ? "checked" : ""}>
    <div class="book-main">
      <label class="book-title" for="book-${book.id}">${escapeHtml(book.title)}</label>
      <p class="byline">Форматы: ${book.formats.map((format) => format.toUpperCase()).join(" · ")}</p>
      <details class="details">
        <summary>Подробнее</summary>
        <p>${escapeHtml(book.description)}</p>
      </details>
    </div>
  </article>`;
}

function getAuthorVisibleBooks() {
  const filter = state.filter.trim().toLocaleLowerCase("ru");
  return booksByAuthor(state.authorId).filter(
    (book) =>
      book.formats.includes(state.format) &&
      (!filter || book.title.toLocaleLowerCase("ru").includes(filter)),
  );
}

function pruneSelection() {
  const visible = new Set(getAuthorVisibleBooks().map((book) => book.id));
  [...state.selected].forEach((id) => {
    if (!visible.has(id)) state.selected.delete(id);
  });
}

function updateDownloadBar() {
  selectedCount.textContent = `Выбрано: ${bookWord(state.selected.size)}`;
  selectedFormat.textContent = `Формат ${state.format.toUpperCase()}`;
  downloadButton.disabled = state.selected.size === 0;
}

function renderAuthorFormats() {
  const available = FORMAT_ORDER.filter((format) =>
    booksByAuthor(state.authorId).some((book) => book.formats.includes(format)),
  );
  if (!available.includes(state.format)) {
    state.format = available[0] || "epub";
  }
  authorFormats.innerHTML = available
    .map(
      (format) =>
        `<button type="button" class="format-tab${format === state.format ? " active" : ""}" data-author-format="${format}" aria-pressed="${format === state.format}">${format.toUpperCase()}</button>`,
    )
    .join("");
}

function renderAuthorBooks() {
  const visible = getAuthorVisibleBooks();
  authorBooks.innerHTML = visible.length
    ? visible.map(authorBookRow).join("")
    : `<p class="empty-inline">Ничего не нашлось. Попробуйте другой фильтр.</p>`;
  updateDownloadBar();
}

function renderSearch() {
  searchInput.value = state.lastQuery;
}

function renderResults(query) {
  state.query = query;
  const normalized = query.toLocaleLowerCase("ru");
  const matchedAuthors = AUTHORS.filter((author) => author.name.toLocaleLowerCase("ru").includes(normalized));
  const matchedBooks = BOOKS.filter(
    (book) =>
      book.title.toLocaleLowerCase("ru").includes(normalized) ||
      book.author.toLocaleLowerCase("ru").includes(normalized),
  );

  resultsTitle.textContent = `Результаты для «${query}»`;

  const parts = [];
  if (matchedBooks.length) parts.push(bookWord(matchedBooks.length));
  if (matchedAuthors.length) parts.push(authorWord(matchedAuthors.length));
  resultsLead.textContent = parts.length
    ? `Найдено: ${parts.join(" и ")}.`
    : "Проверьте написание или попробуйте фамилию автора.";

  if (!matchedBooks.length && !matchedAuthors.length) {
    resultsContent.innerHTML = `<div class="empty-state">
      <p>Ничего не нашлось. Попробуйте другое написание или более короткий запрос.</p>
      <a href="#/search" class="button button-secondary">Новый поиск</a>
    </div>`;
    return;
  }

  let html = "";
  if (matchedAuthors.length) {
    html += `<section aria-labelledby="authors-heading">
      <div class="section-heading"><h2 id="authors-heading">Авторы</h2><span class="count">${matchedAuthors.length}</span></div>
      <div class="panel">${matchedAuthors.map(authorRow).join("")}</div>
    </section>`;
  }
  if (matchedBooks.length) {
    html += `<section aria-labelledby="books-heading">
      <div class="section-heading"><h2 id="books-heading">Книги</h2><span class="count">${matchedBooks.length}</span></div>
      <div class="panel">${matchedBooks.map(bookRow).join("")}</div>
    </section>`;
  }
  resultsContent.innerHTML = html;
}

function renderAuthor(authorId) {
  const author = authorById(authorId);
  if (!author) return;

  if (state.authorId !== authorId) {
    state.authorId = authorId;
    state.format = "epub";
    state.filter = "";
    state.selected.clear();
    authorFilter.value = "";
  }

  authorTitle.textContent = author.name;
  authorLead.textContent = `${bookWord(booksByAuthor(authorId).length)}. Выберите книги и формат.`;
  renderAuthorFormats();
  renderAuthorBooks();
}

function renderRecommendationsList() {
  const recommended = RECOMMENDATION_IDS.map(bookById).filter(Boolean);
  const visible = recommended.slice(0, state.recsVisible);
  recommendationsList.innerHTML = visible.map(bookRow).join("");
  showMoreRecs.hidden = visible.length >= recommended.length;
}

function renderRecommendations() {
  renderRecommendationsList();
}

function renderBookmarks() {
  const saved = BOOKS.filter((book) => bookmarks.has(book.id));
  if (!saved.length) {
    bookmarksContent.innerHTML = `<div class="empty-state">
      <p>Здесь будут книги, которые вы сохранили.</p>
      <a href="#/search" class="button button-secondary">Найти книгу</a>
    </div>`;
    return;
  }
  bookmarksContent.innerHTML = `<section aria-labelledby="saved-heading">
    <div class="section-heading"><h2 id="saved-heading">Сохранённые книги</h2><span class="count">${saved.length}</span></div>
    <div class="panel">${saved.map(bookRow).join("")}</div>
  </section>`;
}

function showToast(title, message) {
  toast.innerHTML = `<strong>${escapeHtml(title)}</strong><span>${escapeHtml(message)}</span>`;
  toast.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 3600);
}

function toggleBookmark(id) {
  if (!bookById(id)) return;
  const saved = !bookmarks.has(id);
  if (saved) bookmarks.add(id);
  else bookmarks.delete(id);
  saveBookmarks();

  document.querySelectorAll(`[data-bookmark="${id}"]`).forEach((button) => {
    button.textContent = saved ? "В закладках" : "В закладки";
    button.setAttribute("aria-pressed", String(saved));
  });

  showToast(
    saved ? "Добавлено в закладки" : "Убрано из закладок",
    "Это сохраняется только в этом браузере.",
  );

  if (document.body.dataset.view === "bookmarks") {
    renderBookmarks();
  }
}

function setView(name) {
  Object.entries(views).forEach(([viewName, view]) => {
    view.hidden = viewName !== name;
  });
  document.body.dataset.view = name;
  document.title = titles[name] || titles.search;
}

function focusHeading(name) {
  const heading = views[name].querySelector("h1");
  if (heading) heading.focus({ preventScroll: true });
}

function parseRoute() {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [name, ...rest] = raw.split("/");
  return { name: name || "search", param: rest.join("/") };
}

function navigate(path) {
  const target = `#/${path}`;
  if (window.location.hash === target) {
    render();
    return;
  }
  window.location.hash = target;
}

function render() {
  const route = parseRoute();
  const name = views[route.name] ? route.name : "search";

  if (name === "results" && !route.param) {
    navigate("search");
    return;
  }
  if (name === "author" && !authorById(route.param)) {
    navigate("search");
    return;
  }

  setView(name);

  if (name === "search") {
    renderSearch();
  } else if (name === "results") {
    let query = route.param;
    try {
      query = decodeURIComponent(route.param);
    } catch (error) {
      // Keep the raw parameter if it is not valid percent-encoding.
    }
    renderResults(query);
  } else if (name === "author") {
    renderAuthor(route.param);
  } else if (name === "recommendations") {
    renderRecommendations();
  } else if (name === "bookmarks") {
    renderBookmarks();
  }

  focusHeading(name);
  window.scrollTo(0, 0);
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (!query) {
    searchInput.focus();
    return;
  }
  state.lastQuery = query;
  navigate(`results/${encodeURIComponent(query)}`);
});

document.querySelectorAll("[data-example]").forEach((button) => {
  button.addEventListener("click", () => {
    searchInput.value = button.dataset.example;
    searchForm.requestSubmit();
  });
});

authorFilter.addEventListener("input", () => {
  state.filter = authorFilter.value;
  pruneSelection();
  renderAuthorBooks();
});

authorFormats.addEventListener("click", (event) => {
  const button = event.target.closest("[data-author-format]");
  if (!button) return;
  state.format = button.dataset.authorFormat;
  renderAuthorFormats();
  pruneSelection();
  renderAuthorBooks();
});

authorBooks.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-select]");
  if (!checkbox) return;
  if (checkbox.checked) state.selected.add(checkbox.dataset.select);
  else state.selected.delete(checkbox.dataset.select);
  checkbox.closest(".author-book")?.classList.toggle("is-selected", checkbox.checked);
  updateDownloadBar();
});

downloadButton.addEventListener("click", () => {
  if (!state.selected.size) return;
  showToast(
    "Скачивание",
    `Выбрано: ${bookWord(state.selected.size)}, формат ${state.format.toUpperCase()}. В прототипе файлы не скачиваются.`,
  );
});

showMoreRecs.addEventListener("click", () => {
  state.recsVisible += 4;
  renderRecommendationsList();
});

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  const formatButton = event.target.closest("[data-download-format]");
  if (formatButton) {
    event.preventDefault();
    const book = bookById(formatButton.dataset.bookId);
    showToast(
      "Демо-режим",
      book
        ? `«${book.title}», формат ${formatButton.dataset.downloadFormat.toUpperCase()}. В прототипе файлы не скачиваются.`
        : "В прототипе файлы не скачиваются.",
    );
    return;
  }

  const bookmark = event.target.closest("[data-bookmark]");
  if (bookmark) {
    event.preventDefault();
    toggleBookmark(bookmark.dataset.bookmark);
  }
});

window.addEventListener("hashchange", render);

if (!window.location.hash || window.location.hash === "#") {
  window.history.replaceState(null, "", "#/search");
}
render();
