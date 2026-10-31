/* Scales the 1920x1080 layout to fill the screen (letterboxed if not 16:9). */
(function () {
  function fit() {
    const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    document.body.style.transform = "scale(" + scale + ")";
  }
  window.addEventListener("resize", fit);
  document.addEventListener("DOMContentLoaded", fit);
})();
