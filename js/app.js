(function () {
  const cfg = window.DASHBOARD_CONFIG;
  const grid = document.getElementById("grid");

  // Renderers return one card or an array of cards (e.g. favorites).
  window.renderDashboard = function () {
    grid.replaceChildren();
    cfg.cards.forEach((card) => {
      const render = window.CARD_TYPES[card.type];
      if (!render) {
        console.warn("Unknown card type:", card.type);
        return;
      }
      [].concat(render(card, cfg)).forEach((node) => grid.appendChild(node));
    });
  };
  window.renderDashboard();

  // Mouse/touch fallback for app tiles
  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) window.launchTile(card);
  });

  const greeting = document.getElementById("greeting");
  const status = document.getElementById("status");
  const updateHeader = () => {
    const h = new Date().getHours();
    const part = h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
    greeting.textContent = `Good ${part}${cfg.name ? ", " + cfg.name : ""}`;
    const build = window.TvBridge && window.TvBridge.version ? " · " + window.TvBridge.version() : "";
    status.textContent = (navigator.onLine ? "● Online" : "○ Offline") + build;
  };
  updateHeader();
  setInterval(updateHeader, 60 * 1000);
  window.addEventListener("online", updateHeader);
  window.addEventListener("offline", updateHeader);

  const first = grid.querySelector(".card:not(.static)");
  if (first) first.focus();
})();
