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
    { type: "clock", size: "wide" },
    {
      type: "weather",
      size: "wide",
      title: "Weather",
      // Set to your location (find coordinates at https://open-meteo.com)
      location: { label: "New York", lat: 40.71, lon: -74.01 },
    },
    {
      type: "app",
      name: "YouTube",
      subtitle: "Watch",
      icon: "▶",
      color: "#c4302b",
      package: "com.google.android.youtube.tv",
      url: "https://www.youtube.com/tv",
    },
    {
      type: "app",
      name: "Netflix",
      subtitle: "Continue watching",
      icon: "N",
      color: "#8e0b13",
      package: "com.netflix.ninja",
      url: "https://www.netflix.com",
    },
    {
      type: "agenda",
      size: "wide",
      title: "Today",
      items: [
        { time: "6:00 PM", text: "Dinner" },
        { time: "8:00 PM", text: "Movie night" },
      ],
    },
    {
      type: "notes",
      size: "wide",
      title: "Notes",
      items: ["Charge the remote", "Pick up popcorn"],
    },
    {
      type: "app",
      name: "Spotify",
      subtitle: "Music",
      icon: "♫",
      color: "#1a7f43",
      package: "com.spotify.tv.android",
      url: "https://open.spotify.com",
    },
    {
      type: "app",
      name: "Prime Video",
      subtitle: "Watch",
      icon: "▷",
      color: "#1a6fb0",
      package: "com.amazon.amazonvideo.livingroom",
      url: "https://www.primevideo.com",
    },
  ],
};
