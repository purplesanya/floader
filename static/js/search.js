const LAST_QUERY_KEY = "floaderLastQuery";
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const loadingOverlay = document.getElementById("loadingOverlay");

if (searchInput) {
  try {
    const lastQuery = localStorage.getItem(LAST_QUERY_KEY);
    if (lastQuery && !searchInput.value) {
      searchInput.value = lastQuery;
    }
  } catch (error) {
    // Private browsing may block storage; the form still works.
  }
}

if (searchForm && searchInput && loadingOverlay) {
  searchForm.addEventListener("submit", () => {
    const query = searchInput.value.trim();
    if (!query) return;
    try {
      localStorage.setItem(LAST_QUERY_KEY, query);
    } catch (error) {
      // Ignore storage failures.
    }
    loadingOverlay.classList.add("active");
    loadingOverlay.setAttribute("aria-hidden", "false");
  });
}

document.querySelectorAll("[data-example]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!searchForm || !searchInput) return;
    searchInput.value = button.dataset.example || "";
    searchForm.requestSubmit();
  });
});
