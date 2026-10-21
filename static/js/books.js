const libraryPanel = document.querySelector(".author-library");
const formatTabs = Array.from(document.querySelectorAll(".format-tab"));
const selectedFormat = document.getElementById("selectedFormat");
const bookList = document.getElementById("bookList");
const emptyState = document.getElementById("emptyState");
const bookFilter = document.getElementById("bookFilter");
const selectAllBtn = document.getElementById("selectAllBtn");
const deselectAllBtn = document.getElementById("deselectAllBtn");
const downloadForm = document.getElementById("downloadForm");
const downloadBtn = document.getElementById("downloadBtn");
const progressContainer = document.getElementById("progressContainer");
const progressText = document.getElementById("progressText");
const progressPercent = document.getElementById("progressPercent");
const progressBar = document.getElementById("progressBar");
const downloadSummary = document.getElementById("downloadSummary");
const formatSummary = document.getElementById("formatSummary");
const showMoreBooks = document.getElementById("showMoreBooks");
const downloadBar = document.getElementById("downloadBar");
const toastContainer = document.getElementById("toastContainer");

const BOOKS_STEP = 20;
const BOOKS_PREFERRED_FORMAT_KEY = "floaderPreferredFormat";
let revealedBooks = BOOKS_STEP;

function readBooksPreferredFormat() {
  try {
    return localStorage.getItem(BOOKS_PREFERRED_FORMAT_KEY) || "";
  } catch (error) {
    return "";
  }
}

function saveBooksPreferredFormat(format) {
  try {
    localStorage.setItem(BOOKS_PREFERRED_FORMAT_KEY, format);
  } catch (error) {
    // Storage is optional.
  }
}

function text(key, replacements = {}) {
  const value = libraryPanel?.dataset[key] || "";
  return Object.entries(replacements).reduce(
    (message, [name, replacement]) => message.replace(`{${name}}`, replacement),
    value,
  );
}

function getCards() {
  return Array.from(bookList?.querySelectorAll(".author-book") || []);
}

function checkboxFor(card) {
  return card.querySelector("[data-select]");
}

function currentFormat() {
  return selectedFormat?.value || "epub";
}

function isVisibleCard(card) {
  return !card.classList.contains("hidden") && !card.classList.contains("is-extra");
}

function setCardSelected(card, selected) {
  const checkbox = checkboxFor(card);
  if (checkbox) checkbox.checked = selected;
  card.classList.toggle("is-selected", selected);
}

function showToast(title, message, type = "success") {
  if (!toastContainer) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icon = document.createElement("div");
  icon.className = "toast-icon";
  icon.textContent = type === "success" ? "OK" : "!";

  const content = document.createElement("div");
  const titleEl = document.createElement("div");
  titleEl.className = "toast-title";
  titleEl.textContent = title;
  const messageEl = document.createElement("div");
  messageEl.className = "toast-message";
  messageEl.textContent = message;

  content.append(titleEl, messageEl);
  toast.append(icon, content);
  toastContainer.appendChild(toast);
  window.setTimeout(() => toast.remove(), 4200);
}

function updateSummary() {
  const cards = getCards();
  const count = cards.filter((card) => checkboxFor(card)?.checked).length;
  const format = currentFormat().toUpperCase();

  if (downloadBtn) downloadBtn.disabled = count === 0;
  if (downloadSummary) {
    downloadSummary.textContent =
      count === 0 ? text("chooseBooks") : text("selectedCount", { count: String(count) });
  }
  if (formatSummary) {
    const output = count <= 1 ? text("singleOutput") : text("zipOutput");
    formatSummary.textContent = `${text("formatSelected", { format })}, ${output}`;
  }
  if (downloadBar) {
    downloadBar.hidden = count === 0 && (!progressContainer || progressContainer.hidden);
  }
}

function applyRevealLimit(filtering) {
  const cards = getCards();
  cards.forEach((card, index) => {
    const extra = !filtering && index >= revealedBooks;
    card.classList.toggle("is-extra", extra);
    if (extra) setCardSelected(card, false);
  });

  if (showMoreBooks) {
    const remaining = Math.max(cards.length - revealedBooks, 0);
    showMoreBooks.hidden = filtering || remaining === 0;
    showMoreBooks.textContent = `${text("loadMore")} (${Math.min(BOOKS_STEP, remaining)})`;
  }
}

function applyFilters() {
  const query = (bookFilter?.value || "").trim().toLocaleLowerCase();
  const format = currentFormat();
  applyRevealLimit(query !== "");
  let visibleCount = 0;

  getCards().forEach((card) => {
    const title = (card.dataset.title || "").toLocaleLowerCase();
    const formats = (card.dataset.formats || "").split(",");
    const visible = !card.classList.contains("is-extra") && title.includes(query) && formats.includes(format);
    card.classList.toggle("hidden", !visible);
    if (!visible) {
      setCardSelected(card, false);
    } else {
      visibleCount += 1;
    }
  });

  if (emptyState) emptyState.hidden = visibleCount !== 0;
  updateSummary();
}

function setFormat(format, persist = false) {
  if (!selectedFormat) return;
  selectedFormat.value = format;
  formatTabs.forEach((tab) => {
    const active = tab.dataset.format === format;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-pressed", active ? "true" : "false");
  });
  if (persist) {
    saveBooksPreferredFormat(format);
  }
  applyFilters();
}

function selectedDownloadPayload() {
  const format = currentFormat();
  const payload = {
    format,
    author_name: document.querySelector('input[name="author_name"]')?.value || "",
    book_titles: [],
    book_links: [],
  };

  getCards()
    .filter((card) => checkboxFor(card)?.checked)
    .forEach((card) => {
      const link = card.getAttribute(`data-link-${format}`);
      if (link) {
        payload.book_titles.push(card.dataset.title || "book");
        payload.book_links.push(link);
      }
    });

  return payload;
}

function localizedStatusMessage(message) {
  if (!message) return text("processing");

  let match = message.match(/^Downloaded (\d+)\/(\d+)$/);
  if (match) return text("downloaded", { done: match[1], total: match[2] });

  match = message.match(/^Archiving (\d+)\/(\d+)$/);
  if (match) return text("archiving", { done: match[1], total: match[2] });

  if (message === "Download ready") return text("downloadReadyTitle");
  if (message === "Starting downloads") return text("startingDownload");
  return message;
}

function setProgress(statusData) {
  const progress = Number(statusData.progress || 0);
  if (progressBar) progressBar.style.width = `${progress}%`;
  if (progressPercent) progressPercent.textContent = `${progress}%`;
  if (progressText) progressText.textContent = localizedStatusMessage(statusData.message);
}

async function pollJob(jobId) {
  const response = await fetch(`/job-status/${encodeURIComponent(jobId)}`);
  const statusData = await response.json().catch(() => ({}));

  if (!response.ok || statusData.status === "error") {
    if (progressContainer) progressContainer.hidden = true;
    if (downloadBtn) downloadBtn.disabled = false;
    showToast(
      text("downloadFailedTitle"),
      statusData.message || text("downloadFailedMessage"),
      "error",
    );
    return;
  }

  setProgress(statusData);

  if (statusData.status === "complete") {
    showToast(text("downloadReadyTitle"), text("downloadReadyMessage"));
    window.location.href = `/fetch/${encodeURIComponent(jobId)}/${statusData.download_token}`;
    window.setTimeout(() => {
      if (progressContainer) progressContainer.hidden = true;
      if (downloadBtn) downloadBtn.disabled = false;
      setProgress({ progress: 0, message: text("preparingDownload") });
    }, 2200);
    return;
  }

  window.setTimeout(() => pollJob(jobId), 1200);
}

formatTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    if (tab.dataset.format) setFormat(tab.dataset.format, true);
  });
});

bookFilter?.addEventListener("input", applyFilters);

selectAllBtn?.addEventListener("click", () => {
  getCards().filter(isVisibleCard).forEach((card) => setCardSelected(card, true));
  updateSummary();
});

deselectAllBtn?.addEventListener("click", () => {
  getCards().forEach((card) => setCardSelected(card, false));
  updateSummary();
});

showMoreBooks?.addEventListener("click", () => {
  revealedBooks = Math.min(revealedBooks + BOOKS_STEP, getCards().length);
  applyFilters();
});

bookList?.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-select]");
  if (!checkbox) return;
  checkbox.closest(".author-book")?.classList.toggle("is-selected", checkbox.checked);
  updateSummary();
});

downloadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = selectedDownloadPayload();
  if (payload.book_links.length === 0) {
    showToast(text("noValidSelectionTitle"), text("noValidSelectionMessage"), "error");
    return;
  }

  if (progressContainer) progressContainer.hidden = false;
  if (downloadBtn) downloadBtn.disabled = true;
  setProgress({ progress: 0, message: text("startingDownload") });

  try {
    const response = await fetch("/start-download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok || !data.job_id) {
      throw new Error(data.error || "Failed to start download.");
    }
    showToast(text("downloadStartedTitle"), text("downloadStartedMessage"));
    pollJob(data.job_id);
  } catch (error) {
    if (progressContainer) progressContainer.hidden = true;
    if (downloadBtn) downloadBtn.disabled = false;
    showToast(text("downloadFailedTitle"), error.message || text("downloadFailedMessage"), "error");
  }
});

const preferredFormatValue = readBooksPreferredFormat();
const preferredTab = formatTabs.find(
  (tab) => tab.dataset.format === preferredFormatValue && !tab.disabled,
);
const firstAvailableTab = preferredTab || formatTabs.find((tab) => !tab.disabled);
if (firstAvailableTab?.dataset.format) {
  setFormat(firstAvailableTab.dataset.format);
} else {
  applyFilters();
}
