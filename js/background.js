/*
 * Background image: one pushed to the TV (served by the Android app at
 * https://dashboard.local/background) wins over `background` in config.js.
 */
(function () {
  const cfg = window.DASHBOARD_CONFIG;
  const dim = cfg.backgroundDim != null ? cfg.backgroundDim : 0.45;

  const root = document.documentElement.style;
  if (cfg.tileOpacity != null) root.setProperty("--tile-alpha", cfg.tileOpacity);
  if (cfg.appTileOpacity != null) root.setProperty("--app-tile-opacity", cfg.appTileOpacity);

  function apply() {
    const version = window.TvBridge && window.TvBridge.backgroundVersion
      ? window.TvBridge.backgroundVersion()
      : "";
    const url = version
      ? "https://dashboard.local/background?v=" + version
      : cfg.background || "";

    document.body.classList.toggle("has-bg", !!url);
    document.body.style.backgroundImage = url
      ? `linear-gradient(rgba(11, 15, 23, ${dim}), rgba(11, 15, 23, ${dim})), url("${url}")`
      : "";
  }

  window.refreshBackground = apply;
  apply();
})();
