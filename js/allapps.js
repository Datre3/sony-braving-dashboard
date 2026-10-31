/*
 * Installed apps, favorites and the All apps screen. App data comes from the
 * Android app's TvBridge; this is what lets the dashboard replace the stock
 * launcher.
 */
(function () {
  const overlay = document.getElementById("all-apps");
  const title = overlay.querySelector(".overlay-title");
  const grid = document.getElementById("apps-grid");
  let returnFocus = null;
  let picking = false;
  let cache = null;

  // [{ name, package, banner?, icon? }] for every installed TV app.
  window.installedApps = function (refresh) {
    if (cache && !refresh) return cache;
    cache = [];
    if (window.TvBridge && window.TvBridge.listApps) {
      try {
        cache = JSON.parse(window.TvBridge.listApps());
      } catch (err) {
        cache = [];
      }
    }
    return cache;
  };

  // Favorite package names, saved on the TV (or in localStorage in a browser).
  window.Favorites = {
    list() {
      try {
        const raw = window.TvBridge && window.TvBridge.getFavorites
          ? window.TvBridge.getFavorites()
          : window.localStorage.getItem("favorites");
        return JSON.parse(raw || "[]");
      } catch (err) {
        return [];
      }
    },
    save(packages) {
      const json = JSON.stringify(packages);
      try {
        if (window.TvBridge && window.TvBridge.setFavorites) window.TvBridge.setFavorites(json);
        else window.localStorage.setItem("favorites", json);
      } catch (err) { /* not saved; nothing else to do */ }
    },
    toggle(pkg) {
      const list = this.list();
      const i = list.indexOf(pkg);
      if (i >= 0) list.splice(i, 1);
      else list.push(pkg);
      this.save(list);
      return i < 0;
    },
  };

  // A focusable tile showing an app's banner (or its icon and name).
  window.appTile = function (app) {
    const node = document.createElement("section");
    node.className = "card app-tile";
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
  };

  // Opens the app list. With { pick: true }, OK pins/unpins favorites instead
  // of launching.
  window.showAllApps = function (opts) {
    picking = !!(opts && opts.pick);
    returnFocus = document.activeElement;
    title.textContent = picking
      ? "Choose favorites · OK to add or remove · Back when done"
      : "All apps";

    const apps = window.installedApps(true);
    const favorites = window.Favorites.list();
    if (apps.length) {
      grid.replaceChildren(...apps.map((app) => {
        const node = window.appTile(app);
        if (picking) {
          node.dataset.pick = "1";
          node.classList.toggle("picked", favorites.includes(app.package));
        }
        return node;
      }));
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

  window.toggleFavorite = function (node) {
    node.classList.toggle("picked", window.Favorites.toggle(node.dataset.package));
  };

  // Returns true if there was an All apps screen to close.
  window.handleBack = function () {
    if (overlay.hidden) return false;
    overlay.hidden = true;
    if (picking) {
      // Favorites may have changed: rebuild the dashboard and refocus the
      // Add favorites tile (the old element was replaced).
      window.renderDashboard();
      returnFocus = document.querySelector('#grid [data-action="editfavorites"]');
    }
    if (returnFocus) returnFocus.focus();
    return true;
  };

  // Home button: close everything and focus the first dashboard card.
  window.goHome = function () {
    overlay.hidden = true;
    const first = document.querySelector("#grid .card:not(.static)");
    if (first) first.focus();
  };

  overlay.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) window.launchTile(card);
  });
})();
