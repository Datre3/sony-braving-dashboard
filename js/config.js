/**
 * Dashboard configuration — edit this file to customise your TV dashboard.
 *
 * Card types:
 *   clock    – time and date
 *   weather  – current conditions + 4-day forecast (Open-Meteo, no API key)
 *   app      – a launch tile. In the Android TV app, `package` launches the
 *              installed app; `url` is used in a browser or as a fallback.
 *   agenda   – a list of { time, text } items
 *   notes    – a list of plain strings
 *
 * Add `size: "wide"` and/or `size: "tall"` to make a card span more grid cells.
 */
window.DASHBOARD_CONFIG = {
  name: "", // shown in the greeting, e.g. "Good evening, Sam"
  use24h: false,
  units: "fahrenheit", // or "celsius"

  cards: [
    {
      type: "app",
      size: "wide tall",
      name: "YouTube",
      subtitle: "Watch",
      icon: "▶",
      color: "#c4302b",
      package: "com.google.android.youtube.tv",
      url: "https://www.youtube.com/tv",
    },
    {
      type: "app",
      size: "wide tall",
      name: "Disney+",
      subtitle: "Watch",
      icon: "D+",
      color: "#0e1b4d",
      package: "com.disney.disneyplus",
      url: "https://www.disneyplus.com",
    },
  ],
};
