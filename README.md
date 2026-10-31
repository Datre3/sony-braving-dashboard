# Sony Bravia Dashboard

A custom home dashboard built for a Sony Bravia (Google TV) screen. It's a
plain static web page, with no build step and no dependencies. It is laid out
for 1920×1080 and you move around it with the TV remote's D-pad.

**Cards included:** clock, live weather (Open-Meteo, no API key needed), app
launch tiles, today's agenda, and notes.

## Customise

Everything lives in [`js/config.js`](js/config.js): your name, 12/24-hour time,
°F/°C, weather location, and the list of cards. Reorder, add, or remove cards
there. Give a card `size: "wide"` or `size: "tall"` to make it bigger.

## Put it on the TV

1. **Host it.** In this repo go to *Settings → Pages*, pick the branch, and
   choose `/ (root)`. You'll get a URL like
   `https://<user>.github.io/sony-braving-dashboard/`.
2. **Open it on the Bravia.** Install a browser from Google Play on the TV
   (e.g. *TV Bro* or *Puffin TV*), open the URL, and bookmark it. For an
   always-on screen, a kiosk app such as *Fully Kiosk Browser* can launch it at
   startup.

## Remote controls

| Button | Action |
| --- | --- |
| ◀ ▲ ▼ ▶ | Move between cards |
| OK | Open the focused app tile |
| Back | Return to the dashboard |

## Preview locally

```sh
python3 -m http.server 8080
# open http://localhost:8080
```
