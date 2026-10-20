document.querySelectorAll("[data-card-show-more]").forEach((button) => {
  const panel = button.previousElementSibling;
  if (!panel || !panel.matches("[data-card-list]")) return;

  const cards = Array.from(panel.querySelectorAll(":scope > .row"));
  if (cards.length === 0) return;

  const step = Math.max(1, Number(button.dataset.step) || 12);
  const label = button.textContent.trim();
  let visible = step;

  const update = () => {
    const remaining = Math.max(cards.length - visible, 0);
    button.hidden = remaining === 0;
    button.textContent = remaining > 0 ? `${label} (${Math.min(step, remaining)})` : label;
  };

  cards.forEach((card, index) => {
    card.classList.toggle("is-extra", index >= visible);
  });
  update();

  button.addEventListener("click", () => {
    const next = Math.min(visible + step, cards.length);
    cards.slice(visible, next).forEach((card) => {
      card.classList.remove("is-extra");
    });
    visible = next;
    update();
  });
});
