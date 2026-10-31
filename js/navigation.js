/*
 * Spatial D-pad navigation: arrow keys move focus to the nearest card in that
 * direction. Works with the Bravia remote in the TV browser and with a keyboard.
 */
(function () {
  const KEYS = {
    ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down",
    37: "left", 39: "right", 38: "up", 40: "down",
  };

  // Cards in the All apps screen when it's open, otherwise the dashboard.
  function scope() {
    return document.querySelector(".overlay:not([hidden])") || document.getElementById("grid");
  }

  // Gap between two ranges on one axis (0 when they overlap).
  function gap(a1, a2, b1, b2) {
    return Math.max(0, b1 - a2, a1 - b2);
  }

  function nextCard(from, dir) {
    const a = from.getBoundingClientRect();
    let best = null;
    let bestScore = Infinity;

    scope().querySelectorAll(".card:not(.static)").forEach((card) => {
      if (card === from) return;
      const b = card.getBoundingClientRect();
      const inDir =
        (dir === "left" && b.right <= a.left + 1) ||
        (dir === "right" && b.left >= a.right - 1) ||
        (dir === "up" && b.bottom <= a.top + 1) ||
        (dir === "down" && b.top >= a.bottom - 1);
      if (!inDir) return;

      // Edge-to-edge distance along the move, plus a penalty for cards that
      // don't line up with the current one on the cross axis.
      const horizontal = dir === "left" || dir === "right";
      const main = horizontal
        ? gap(a.left, a.right, b.left, b.right)
        : gap(a.top, a.bottom, b.top, b.bottom);
      const cross = horizontal
        ? gap(a.top, a.bottom, b.top, b.bottom)
        : gap(a.left, a.right, b.left, b.right);
      const offset = horizontal
        ? Math.abs(b.top - a.top)
        : Math.abs(b.left - a.left);
      const score = main + cross * 4 + offset * 0.1;
      if (score < bestScore) { bestScore = score; best = card; }
    });
    return best;
  }

  document.addEventListener("keydown", (e) => {
    const dir = KEYS[e.key] || KEYS[e.keyCode];
    const active = document.activeElement;

    if (dir) {
      e.preventDefault();
      if (!active || !active.classList.contains("card")) {
        const first = scope().querySelector(".card:not(.static)");
        if (first) first.focus();
        return;
      }
      const target = nextCard(active, dir);
      if (target) target.focus();
      return;
    }

    // Back in a desktop browser (the Android app handles the remote's Back).
    if (e.key === "Escape" || e.key === "Backspace") {
      e.preventDefault();
      if (window.handleBack) window.handleBack();
      return;
    }

    if ((e.key === "Enter" || e.keyCode === 13) && active && active.classList.contains("card")) {
      e.preventDefault();
      window.launchTile(active);
    }
  });
})();
