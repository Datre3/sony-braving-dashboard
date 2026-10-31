(function () {
  const cfg = window.DASHBOARD_CONFIG;
  const grid = document.getElementById("grid");

  cfg.cards.forEach((card) => {
    const render = window.CARD_TYPES[card.type];
    if (!render) {
      console.warn("Unknown card type:", card.type);
      return;
    }
    grid.appendChild(render(card, cfg));
  });

  // Mouse/touch fallback for app tiles
  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card && card.dataset.url) window.location.href = card.dataset.url;
  });

  const greeting = document.getElementById("greeting");
  const status = document.getElementById("status");
  const updateHeader = () => {
    const h = new Date().getHours();
    const part = h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
    greeting.textContent = `Good ${part}${cfg.name ? ", " + cfg.name : ""}`;
    status.textContent = navigator.onLine ? "● Online" : "○ Offline";
  };
  updateHeader();
  setInterval(updateHeader, 60 * 1000);
  window.addEventListener("online", updateHeader);
  window.addEventListener("offline", updateHeader);

  const first = grid.querySelector(".card");
  if (first) first.focus();
})();
