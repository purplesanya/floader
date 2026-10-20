const detailRoot = document.querySelector(".book-detail-root");
const detailCache = new Map();
const formatOrder = ["epub", "fb2", "mobi", "pdf", "docx"];

function detailText(key) {
  return detailRoot?.dataset[key] || "";
}

function escapedBookId(bookId) {
  return window.CSS?.escape ? CSS.escape(bookId) : String(bookId).replace(/"/g, '\\"');
}

async function fetchBookDetails(bookId) {
  if (detailCache.has(bookId)) return detailCache.get(bookId);

  const promise = fetch(`/book-details/${encodeURIComponent(bookId)}`)
    .then((response) => {
      if (!response.ok) throw new Error("Details unavailable");
      return response.json();
    })
    .catch(() => ({
      book_id: bookId,
      description: "",
      links: {},
      error: true,
    }));

  detailCache.set(bookId, promise);
  return promise;
}

function updateDescriptions(bookId, details) {
  const description = details.description || detailText("noBookDescription") || detailText("detailsFailed");
  document.querySelectorAll(`.book-description[data-book-id="${escapedBookId(bookId)}"]`).forEach((node) => {
    node.textContent = description;
    node.classList.toggle("muted-empty", !details.description);
  });
}

function buildDownloadLink(bookId, title, format) {
  const link = document.createElement("a");
  link.className = "format-button";
  link.href = `/download-book/${encodeURIComponent(bookId)}/${encodeURIComponent(format)}?${new URLSearchParams({ title })}`;
  link.textContent = format.toUpperCase();
  const labelTemplate = detailText("downloadFormatLabel");
  if (labelTemplate) {
    link.setAttribute(
      "aria-label",
      labelTemplate.replace("{title}", title).replace("{format}", format.toUpperCase()),
    );
  }
  return link;
}

function updateDownloads(bookId, details) {
  document.querySelectorAll(`.inline-downloads[data-book-id="${escapedBookId(bookId)}"]`).forEach((node) => {
    const title = node.dataset.title || details.title || "book";
    const links = details.links || {};
    const formats = formatOrder.filter((format) => links[format]);
    node.replaceChildren();

    if (!formats.length) {
      const empty = document.createElement("span");
      empty.className = "download-loading";
      empty.textContent = detailText("detailsFailed");
      node.appendChild(empty);
      return;
    }

    node.append(...formats.map((format) => buildDownloadLink(bookId, title, format)));
  });
}

async function hydrateBook(bookId) {
  const details = await fetchBookDetails(bookId);
  updateDescriptions(bookId, details);
  updateDownloads(bookId, details);
}

function observeDetails() {
  const targets = [...document.querySelectorAll("[data-detail-card][data-book-id]")];
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    [...new Set(targets.map((node) => node.dataset.bookId))].forEach(hydrateBook);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const bookId = entry.target.dataset.bookId;
        observer.unobserve(entry.target);
        if (bookId) hydrateBook(bookId);
      });
    },
    { rootMargin: "240px 0px" },
  );

  targets.forEach((target) => {
    if (target.dataset.detailObserved === "true") return;
    target.dataset.detailObserved = "true";
    observer.observe(target);
  });
}

document.addEventListener("bookmarks:updated", observeDetails);
observeDetails();
