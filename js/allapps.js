/*
 * All apps screen: lists every installed TV app (from the Android app's
 * TvBridge.listApps) so the dashboard can replace the stock launcher.
 */
(function () {
  const overlay = document.getElementById("all-apps");
  const grid = document.getElementById("apps-grid");
  let returnFocus = null;

  function installedApps() {
    if (!window.TvBridge || !window.TvBridge.listApps) return [];
    try {
      return JSON.parse(window.TvBridge.listApps());
    } catch (err) {
      return [];
    }
  }

  function tile(app) {
    const node = document.createElement("section");
    node.className = "card app";
    node.tabIndex = 0;
    node.dataset.package = app.package;
    node.title = app.name;

    const img = document.createElement("img");
    img.alt = app.name;
    if (app.banner) {
      img.className = "banner";
      img.src = app.banner;
      node.appendChild(img);
    } else {
      img.className = "icon";
      img.src = app.icon;
      const label = document.createElement("div");
      label.className = "app-label";
      label.textContent = app.name;
      node.append(img, label);
    }
    return node;
  }

  window.showAllApps = function () {
    returnFocus = document.activeElement;
    const apps = installedApps();
    if (apps.length) {
      grid.replaceChildren(...apps.map(tile));
    } else {
      const empty = document.createElement("p");
      empty.className = "apps-empty";
      empty.textContent = "The app list is only available in the Android TV app.";
      grid.replaceChildren(empty);
    }
    overlay.hidden = false;
    overlay.scrollTop = 0;
    const first = grid.querySelector(".card");
    if (first) first.focus();
  };

  // Returns true if there was an All apps screen to close.
  window.handleBack = function () {
    if (overlay.hidden) return false;
    overlay.hidden = true;
    if (returnFocus) returnFocus.focus();
    return true;
  };

  // Home button: close everything and focus the first dashboard card.
  window.goHome = function () {
    overlay.hidden = true;
    const first = document.querySelector("#grid .card");
    if (first) first.focus();
  };

  overlay.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) window.launchTile(card);
  });
})();
