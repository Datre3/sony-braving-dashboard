// Renders banner.html and icon.html into the app's PNG resources.
// Usage (from this folder): node render.js   — requires Playwright.
const path = require("path");
const { chromium } = require("playwright");

const res = path.join(__dirname, "..", "app", "src", "main", "res");
const DENSITIES = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };

async function render(browser, html, size, scale, out) {
  const page = await browser.newPage({ viewport: size, deviceScaleFactor: scale });
  await page.goto("file://" + path.join(__dirname, html));
  await page.screenshot({ path: out, omitBackground: true });
  await page.close();
}

(async () => {
  const browser = await chromium.launch();
  // The banner is only required at xhdpi (320x180 px); the launcher scales it.
  await render(browser, "banner.html", { width: 320, height: 180 }, 1,
    path.join(res, "drawable-xhdpi", "banner.png"));
  for (const [name, scale] of Object.entries(DENSITIES)) {
    await render(browser, "icon.html", { width: 48, height: 48 }, scale,
      path.join(res, "mipmap-" + name, "ic_launcher.png"));
  }
  await browser.close();
})();
