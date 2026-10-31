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
  use24h: false,
  units: "fahrenheit", // or "celsius"

  cards: [
    // Apps you pin on the TV with "Add favorites" (up to 8).
    { type: "favorites", max: 8 },
    {
      type: "app",
      name: "Add favorites",
      subtitle: "Pin apps here",
      icon: "+",
      color: "#1d2535",
      size: "bottom", // keep on the bottom row
      action: "editfavorites",
    },
    {
      type: "app",
      name: "All apps",
      subtitle: "Everything installed",
      icon: "▦",
      color: "#1d2535",
      size: "bottom", // keep on the bottom row
      action: "allapps",
    },
    {
      type: "app",
      name: "Settings",
      subtitle: "TV settings",
      icon: "⚙",
      color: "#1d2535",
      size: "bottom", // keep on the bottom row
      action: "settings",
    },
  ],
};
