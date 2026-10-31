# Sony Bravia Dashboard

A custom home dashboard for a Sony Bravia (Google TV / Android TV). It installs
as an app with its own **banner tile on the TV home screen**. Open the tile and
you get a full-screen dashboard you move around with the remote's D-pad. App
tiles on the dashboard launch the real installed TV apps.

![Home-screen banner](android/app/src/main/res/drawable-xhdpi/banner.png)

**Cards included:** clock, live weather (Open-Meteo, no API key needed), app
launch tiles, today's agenda, and notes.

## Customise

Everything lives in [`js/config.js`](js/config.js): your name, 12/24-hour time,
°F/°C, weather location, and the list of cards. Reorder, add, or remove cards
there. Give a card `size: "wide"` or `size: "tall"` to make it bigger.

## Install it on the TV (home-screen app)

The Android TV app lives in [`android/`](android/). It bundles the dashboard
(`index.html`, `css/`, `js/`) inside the APK, so nothing needs to be hosted.

**1. Build the APK**: open the `android/` folder in Android Studio and pick
*Build → Build APK(s)*, or from a terminal with the Android SDK installed:

```sh
cd android
./gradlew assembleRelease
# → app/build/outputs/apk/release/app-release.apk
```

**2. Turn on developer mode on the Bravia**: *Settings → System → About*, then
press OK on *Android TV OS build* (or *Build*) 7 times. Then under
*Settings → System → Developer options*, turn on *USB debugging* / *Network
debugging*. Note the TV's IP address (*Settings → Network & Internet*).

**3. Sideload it** from your computer on the same network:

```sh
adb connect <tv-ip-address>
adb install -r app/build/outputs/apk/release/app-release.apk
```

Accept the prompt on the TV the first time. (No computer? The *Send Files to
TV* app from Google Play plus a file manager also works.)

**4. Pin the tile**: *Dashboard* now shows up under *Apps* on the home screen.
Long-press it with the OK button and choose *Move* / *Add to favorites* to put
it in the top row.

After editing `js/config.js`, rebuild and reinstall to update the app.

### Customising the home-screen tile

- **Name:** `android/app/src/main/res/values/strings.xml` (`app_name`)
- **Banner and icon art:** edit `android/branding/banner.html` / `icon.html`,
  then run `node android/branding/render.js` (requires Playwright) to regenerate
  the PNGs. You can also drop in your own 320×180 `banner.png`.
- **Which app a tile launches:** set `package` on an `app` card in
  `js/config.js`. To find an app's package name, run
  `adb shell pm list packages`.

| App | Package |
| --- | --- |
| YouTube | `com.google.android.youtube.tv` |
| Netflix | `com.netflix.ninja` |
| Prime Video | `com.amazon.amazonvideo.livingroom` |
| Spotify | `com.spotify.tv.android` |

If an app isn't installed, the tile opens its Play Store page instead.

## Alternative: open it in the TV browser

The dashboard also runs as a plain web page. Host the repo root with GitHub
Pages (*Settings → Pages*) and open the URL in a TV browser such as *TV Bro*.
In a browser, app tiles open their `url` instead of launching the app.

## Remote controls

| Button | Action |
| --- | --- |
| ◀ ▲ ▼ ▶ | Move between cards |
| OK | Launch the focused app tile |
| Back | Return to the TV home screen |

## Preview locally

```sh
python3 -m http.server 8080
# open http://localhost:8080
```
