/* Card renderers. Each takes (cardConfig, globalConfig) and returns an element. */
(function () {
  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  };

  function shell(card, extraClass) {
    const node = el("section", "card" + (extraClass ? " " + extraClass : ""));
    node.tabIndex = 0;
    (card.size || "").split(/\s+/).filter(Boolean).forEach((s) => node.classList.add(s));
    if (card.title) node.appendChild(el("h2", "card-title", card.title));
    const body = el("div", "card-body");
    node.appendChild(body);
    return { node, body };
  }

  function clock(card, cfg) {
    const { node, body } = shell(card);
    const time = el("div", "clock-time");
    const date = el("div", "clock-date");
    body.append(time, date);
    const tick = () => {
      const now = new Date();
      time.textContent = now.toLocaleTimeString([], {
        hour: "numeric", minute: "2-digit", hour12: !cfg.use24h,
      });
      date.textContent = now.toLocaleDateString([], {
        weekday: "long", month: "long", day: "numeric",
      });
    };
    tick();
    setInterval(tick, 1000);
    return node;
  }

  // WMO weather codes -> [icon, description]
  const WMO = {
    0: ["☀️", "Clear"], 1: ["🌤️", "Mostly clear"], 2: ["⛅", "Partly cloudy"],
    3: ["☁️", "Overcast"], 45: ["🌫️", "Fog"], 48: ["🌫️", "Fog"],
    51: ["🌦️", "Drizzle"], 53: ["🌦️", "Drizzle"], 55: ["🌦️", "Drizzle"],
    61: ["🌧️", "Rain"], 63: ["🌧️", "Rain"], 65: ["🌧️", "Heavy rain"],
    71: ["🌨️", "Snow"], 73: ["🌨️", "Snow"], 75: ["❄️", "Heavy snow"],
    80: ["🌦️", "Showers"], 81: ["🌧️", "Showers"], 82: ["⛈️", "Heavy showers"],
    95: ["⛈️", "Thunderstorm"], 96: ["⛈️", "Thunderstorm"], 99: ["⛈️", "Thunderstorm"],
  };
  const wmo = (code) => WMO[code] || ["🌡️", "—"];

  function weather(card, cfg) {
    const { node, body } = shell(card);
    body.classList.add("weather");
    const loc = card.location;
    const title = node.querySelector(".card-title");
    if (title && loc.label) title.textContent = `${card.title} · ${loc.label}`;
    body.appendChild(el("div", "weather-desc", "Loading…"));

    const load = async () => {
      const url = "https://api.open-meteo.com/v1/forecast" +
        `?latitude=${loc.lat}&longitude=${loc.lon}` +
        "&current=temperature_2m,weather_code" +
        "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
        `&temperature_unit=${cfg.units}&timezone=auto&forecast_days=5`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.status);
        const data = await res.json();
        const [icon, desc] = wmo(data.current.weather_code);

        const now = el("div", "weather-now");
        const text = el("div");
        text.append(
          el("div", "weather-temp", Math.round(data.current.temperature_2m) + "°"),
          el("div", "weather-desc", desc)
        );
        now.append(el("div", "weather-icon", icon), text);

        const days = el("div", "weather-days");
        data.daily.time.slice(1).forEach((day, i) => {
          const d = el("div");
          const name = new Date(day + "T12:00").toLocaleDateString([], { weekday: "short" });
          d.append(
            el("span", null, name),
            document.createTextNode(wmo(data.daily.weather_code[i + 1])[0] + " "),
            document.createTextNode(Math.round(data.daily.temperature_2m_max[i + 1]) + "°"),
            el("span", null, Math.round(data.daily.temperature_2m_min[i + 1]) + "°")
          );
          days.appendChild(d);
        });
        body.replaceChildren(now, days);
      } catch (err) {
        body.replaceChildren(el("div", "error", "Weather unavailable"));
      }
    };
    load();
    setInterval(load, 15 * 60 * 1000);
    return node;
  }

  function app(card) {
    const { node, body } = shell({ ...card, title: null }, "app");
    if (card.color) node.style.background = card.color;
    body.append(
      el("div", "app-icon", card.icon || "★"),
      el("div", "app-name", card.name),
      el("div", "app-sub", card.subtitle || "")
    );
    node.dataset.url = card.url || "";
    node.dataset.package = card.package || "";
    return node;
  }

  function list(card, render) {
    const { node, body } = shell(card);
    const ul = el("ul", "list");
    (card.items || []).forEach((item) => ul.appendChild(render(item)));
    body.appendChild(ul);
    return node;
  }

  const agenda = (card) => list(card, (item) => {
    const li = el("li");
    li.append(el("span", "when", item.time), el("span", null, item.text));
    return li;
  });

  const notes = (card) => list(card, (text) => el("li", null, "• " + text));

  window.CARD_TYPES = { clock, weather, app, agenda, notes };

  // Open an app tile. Inside the Android TV app this launches the installed
  // app by package name; in a plain browser it follows the URL.
  window.launchTile = function (node) {
    const { url, package: pkg } = node.dataset;
    if (!url && !pkg) return;
    if (window.TvBridge) {
      window.TvBridge.launch(pkg || "", url || "");
    } else if (url) {
      window.location.href = url;
    }
  };
})();
