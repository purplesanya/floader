const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const loadingOverlay = document.getElementById("loadingOverlay");

if (searchForm && searchInput && loadingOverlay) {
  searchForm.addEventListener("submit", () => {
    if (searchInput.value.trim()) {
      loadingOverlay.classList.add("active");
      loadingOverlay.setAttribute("aria-hidden", "false");
    }
  });
}

document.querySelectorAll("[data-example]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!searchForm || !searchInput) return;
    searchInput.value = button.dataset.example || "";
    searchForm.requestSubmit();
  });
});
