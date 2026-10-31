/**
 * Dashboard configuration — edit this file to customise your TV dashboard.
 *
 * Card types:
 *   clock    – time and date
 *   weather  – current conditions + 4-day forecast (Open-Meteo, no API key)
 *   app      – a launch tile. In the Android TV app, `package` launches the
 *              installed app; `url` is used in a browser or as a fallback.
 *              Instead of a package, `action` can be "allapps" (All apps
 *              screen), "editfavorites" (choose favorites) or "settings".
 *   agenda   – a list of { time, text } items
 *   notes    – a list of plain strings
 *   favorites – the apps pinned on the TV with an `action: "editfavorites"`
 *              tile (which opens the app list in pick mode)
 *
 * Add `size: "wide"` and/or `size: "tall"` to make a card span more grid cells,
 * `size: "full"` for a whole row, or `size: "bottom"` to pin it to the last row.
 */
window.DASHBOARD_CONFIG = {
  name: "", // shown in the greeting, e.g. "Good evening, Sam"
  // Custom header text instead of "Good morning/afternoon/evening".
  // Set to "" to go back to the time-of-day greeting.
  greeting: "Happy Birthday Zane!",
  use24h: false,
  units: "fahrenheit", // or "celsius"

  // Background image. Easiest: push one to the TV with adb (see README), no
  // rebuild needed. Or set a path to an image in this repo's images/ folder,
  // e.g. "images/background.jpg", or an https:// URL.
  background: "",
  backgroundDim: 0.45, // darkening over the image: 0 = none, 1 = black

  // Tile transparency (0 = fully see-through, 1 = solid). The selected tile
  // is always shown solid.
  tileOpacity: 0.35, // background of the Add favorites / All apps / Settings tiles
  appTileOpacity: 0.8, // whole app tiles (banners) when not selected

  cards: [
    // Apps you pin on the TV with "Add favorites" (up to 8).
    { type: "favorites", max: 8 },
    {
      type: "app",
      name: "Add favorites",
      subtitle: "Pin apps here",
      icon: "+",
      size: "bottom", // keep on the bottom row
      action: "editfavorites",
    },
    {
      type: "app",
      name: "All apps",
      subtitle: "Everything installed",
      icon: "▦",
      size: "bottom", // keep on the bottom row
      action: "allapps",
    },
    {
      type: "app",
      name: "Settings",
      subtitle: "TV settings",
      icon: "⚙",
      size: "bottom", // keep on the bottom row
      action: "settings",
    },
  ],
};
