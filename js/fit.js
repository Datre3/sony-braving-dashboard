/* Scales the 1920x1080 layout to fill the screen (letterboxed if not 16:9). */
(function () {
  function fit() {
    // clientWidth/Height is the real screen size in CSS px. innerWidth can't be
    // used: on Android WebView it grows to the 1920px content width.
    const root = document.documentElement;
    const width = root.clientWidth || window.innerWidth;
    const height = root.clientHeight || window.innerHeight;
    const scale = Math.min(width / 1920, height / 1080);
    document.body.style.transform = "scale(" + scale + ")";
  }
  window.addEventListener("resize", fit);
  document.addEventListener("DOMContentLoaded", fit);
  if (document.body) fit();
})();
