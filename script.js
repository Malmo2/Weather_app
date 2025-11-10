const API_KEY = "37cf80aeb0724a5f8bd81720250311";

const searchBtn = document.getElementById("searchBtn");
const input = document.querySelector(".search input");
const weatherIcon = document.querySelector(".weather-icon");
const cityInput = document.querySelector(".city");
const tempInput = document.querySelector(".temp");
const windInput = document.querySelector(".wind");
const humidityInput = document.querySelector(".humidity");
const historyList = document.getElementById("historyList");
const clearBtn = document.getElementById("clearHistoryBtn");

let searchHistory = JSON.parse(localStorage.getItem("searchHistoryFull")) || [];

/* ---------------- ICON PICKER ---------------- */
function pickIcon(conditionText = "") {
  const t = conditionText.toLowerCase();
  if (t.includes("thunder")) return "images/thunder.png";
  if (t.includes("snow")) return "images/snow.png";
  if (t.includes("rain") || t.includes("drizzle") || t.includes("shower")) return "images/rain.png";
  if (t.includes("mist") || t.includes("fog") || t.includes("haze")) return "images/mist.png";
  if (t.includes("cloud") || t.includes("overcast") || t.includes("partly")) return "images/clouds.png";
  return "images/clear.png";
}

/* ---------------- FETCH ---------------- */
async function checkWeather(query) {
  try {
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(query)}&aqi=no`;
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error("Could not fetch data");

    const data = await res.json();

    // Update main card
    cityInput.textContent = `${data.location.name}, ${data.location.country}`;
    tempInput.textContent = `${Math.round(data.current.temp_c)}°C`;
    windInput.textContent = `${Math.round(data.current.wind_kph)} km/h`;
    humidityInput.textContent = `${data.current.humidity}%`;
    weatherIcon.src = pickIcon(data.current.condition.text);

    // Save and update history
    saveHistory({
      name: data.location.name,
      country: data.location.country,
      temp_c: Math.round(data.current.temp_c),
      wind_kph: Math.round(data.current.wind_kph),
      humidity: data.current.humidity,
      condition: data.current.condition.text,
    });
  } catch (err) {
    console.error("Could not fetch data.", err.message);
  }
}

/* ---------------- HISTORY ---------------- */
function saveHistory(entry) {
  if (!entry || !entry.name) return;

  const key = `${entry.name}|${entry.country}`.toLowerCase();
  searchHistory = searchHistory.filter(
    (e) => `${e.name}|${e.country}`.toLowerCase() !== key
  );

  searchHistory.unshift(entry);
  if (searchHistory.length > 10) searchHistory.length = 10;

  localStorage.setItem("searchHistoryFull", JSON.stringify(searchHistory));
  renderHistory();
}

function renderHistory() {
  if (!historyList) return;
  historyList.innerHTML = "";

  if (searchHistory.length === 0) {
    historyList.innerHTML = `<p class="no-history">No recent searches</p>`;
    return;
  }

  searchHistory.slice(0, 3).forEach((e) => {
    const card = document.createElement("div");
    card.className = "history-card";

    const head = document.createElement("div");
    head.className = "history-head";

    const city = document.createElement("p");
    city.className = "history-city";
    city.textContent = `${e.name}, ${e.country}`;

    const icon = document.createElement("img");
    icon.className = "history-icon";
    icon.src = pickIcon(e.condition);
    icon.alt = e.condition;

    head.append(city, icon);

    const rows = document.createElement("div");
    rows.className = "history-rows";
    rows.innerHTML = `
      <p>Temp: ${e.temp_c}°C</p>
      <p>Wind: ${e.wind_kph} km/h</p>
      <p>Humidity: ${e.humidity}%</p>
      <p>Condition: ${e.condition}</p>
    `;

    card.append(head, rows);

    card.addEventListener("click", () => {
      checkWeather(`${e.name}, ${e.country}`);
    });

    historyList.appendChild(card);
  });
}

function clearHistory() {
  localStorage.removeItem("searchHistoryFull");
  searchHistory = [];
  renderHistory();
}

/* ---------------- EVENTS ---------------- */
searchBtn.addEventListener("click", () => {
  const query = input.value.trim() || "Stockholm";
  checkWeather(query);
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const query = input.value.trim() || "Stockholm";
    checkWeather(query);
  }
});

clearBtn?.addEventListener("click", clearHistory);

/* ---------------- INITIAL ---------------- */
checkWeather("Stockholm");
renderHistory();