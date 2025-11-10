const API_KEY = "37cf80aeb0724a5f8bd81720250311";
const searchBtn = document.getElementById("searchBtn");
const input = document.querySelector(".search input");
const weatherIcon = document.querySelector(".weather-icon"); // main big icon (optional)
const cityInput = document.querySelector(".city");
const tempInput = document.querySelector(".temp");
const windInput = document.querySelector(".wind");
const humidityInput = document.querySelector(".humidity");

const historyList = document.getElementById("historyList");

// Load saved history (with full data) or create empty array
let searchHistory = JSON.parse(localStorage.getItem("searchHistoryFull")) || [];

// ----------------- ICON PICKER -----------------
function pickIcon(conditionText = "") {
  const t = conditionText.toLowerCase();
  if (t.includes("rain")) return "images/rain.png";
  if (t.includes("cloud")) return "images/clouds.png";
  if (t.includes("snow")) return "images/snow.png";
  if (t.includes("mist") || t.includes("fog")) return "images/mist.png";
  return "images/clear.png";
}


async function checkWeather(query) {
  try {
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(
      query
    )}&aqi=no`;
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error("Could not fetch data");

    const data = await res.json();
    console.log(data);

    // --- Update main weather UI ---
    cityInput.textContent = `${data.location.name}, ${data.location.country}`;
    tempInput.textContent = `${data.current.temp_c}°C`;
    windInput.textContent = `${data.current.wind_kph} km/h`;
    humidityInput.textContent = `${data.current.humidity}%`;
    weatherIcon.src = pickIcon(data.current.condition.text);

    // --- Save full history entry & update UI ---
    saveHistory({
      name: data.location.name,
      country: data.location.country,
      temp_c: Math.round(data.current.temp_c),
      wind_kph: Math.round(data.current.wind_kph),
      humidity: data.current.humidity,
      condition: data.current.condition.text,
    });
    
const results = document.getElementById("results");
// --- Icon resolver (returns a relative image path) ---
function pickIcon(conditionText = "") {
  const t = String(conditionText).toLowerCase();
  if (t.includes("snow")) return "images/snow.png";
  if (t.includes("rain") || t.includes("drizzle")) return "images/rain.png";
  if (t.includes("thunder")) return "images/thunder.png";
  if (t.includes("mist") || t.includes("fog") || t.includes("haze")) return "images/mist.png";
  if (t.includes("cloud")) return "images/clouds.png";
  return "images/clear.png";
}
// --- Fetch current weather and return parsed data ---
async function checkWeather(q) {
  try {
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(q)}&aqi=no`;
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
    const data = await response.json();
    // Update the main hero values if those nodes exist
    if (cityInput) cityInput.textContent = `${data.location.name}, ${data.location.country}`;
    if (tempInput) tempInput.textContent = `${Math.round(data.current.temp_c)}°C`;
    if (windInput) windInput.textContent = `${Math.round(data.current.wind_kph)} km/h`;
    if (humidityInput) humidityInput.textContent = `${data.current.humidity}%`;
    if (weatherIcon) weatherIcon.src = pickIcon(data.current.condition.text);
    return data; // <-- critical for renderCard()

  } catch (err) {
    console.error("Could not fetch data.", err.message);
    return null;
  }
}

// ----------------- HISTORY FUNCTIONS -----------------
function saveHistory(entry) {
  if (!entry || !entry.name) return;

  // Remove duplicates (case-insensitive)
  const key = `${entry.name}|${entry.country}`.toLowerCase();
  searchHistory = searchHistory.filter(
    (e) => `${e.name}|${e.country}`.toLowerCase() !== key
  );

  // Add to front and limit to 10
  searchHistory.unshift(entry);
  if (searchHistory.length > 10) searchHistory.length = 10;

  // Save to localStorage
  localStorage.setItem("searchHistoryFull", JSON.stringify(searchHistory));

  renderHistory();
}

function renderHistory() {
  if (!historyList) return;
  historyList.innerHTML = "";

  // Show only last 3 searches
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

    // Clicking the history card re-loads that city
    card.addEventListener("click", () => {
      checkWeather(`${e.name}, ${e.country}`);
    });

    historyList.appendChild(card);
  });
}

// ----------------- EVENT LISTENERS -----------------
searchBtn.addEventListener("click", () => {
  const query = input.value.trim() || "Stockholm";
  checkWeather(query);
});
// --- Optional: Enter key triggers search ---
// input.addEventListener("keydown", async (e) => {
//   if (e.key === "Enter") searchBtn.click();
// });
// --- Optional: Clear history button safety guard (only if you actually implemented history) ---
document.getElementById("clearHistoryBtn")?.addEventListener("click", () => {
  if (typeof displayHistory === "function") {
    localStorage.removeItem("searchHistory");
    window.searchHistory = [];
    displayHistory();
  }
});
// --- Initial load: Stockholm ---
(async () => {
  const d = await checkWeather("59.3293,18.0686");
  renderCard(d);
})();





// ----------------- INITIAL LOAD -----------------
checkWeather("Stockholm");
renderHistory();
