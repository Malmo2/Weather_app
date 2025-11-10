const API_KEY = "37cf80aeb0724a5f8bd81720250311";
const searchBtn = document.getElementById("searchBtn");
const input = document.querySelector(".search input");
const weatherIcon = document.querySelector(".weather-icon"); // main big icon (optional)
const cityInput = document.querySelector(".city");
const tempInput = document.querySelector(".temp");
const windInput = document.querySelector(".wind");
const humidityInput = document.querySelector(".humidity");
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
// --- Card renderer for the results grid ---
function renderCard(data) {
  if (!data) return;
  const card = document.createElement("div");
  card.className = "weather-card";
  const header = document.createElement("div");
  header.className = "weather-header";
  const title = document.createElement("h2");
  title.textContent = `${data.location.name}, ${data.location.country}`;
  const icon = document.createElement("img");
  icon.src = pickIcon(data.current.condition.text);
  icon.alt = data.current.condition.text;
  icon.className = "weather-icon";
  header.append(title, icon);
  const body = document.createElement("div");
  body.className = "weather-body";
  const temp = document.createElement("p");
  temp.textContent = `Temp: ${Math.round(data.current.temp_c)}°C`;
  const wind = document.createElement("p");
  wind.textContent = `Wind: ${Math.round(data.current.wind_kph)} km/h`;
  const humidity = document.createElement("p");
  humidity.textContent = `Humidity: ${data.current.humidity}%`;
  const condition = document.createElement("p");
  condition.textContent = `Condition: ${data.current.condition.text}`;
  body.append(temp, wind, humidity, condition);
  card.append(header, body);
  // Add to results (most recent first). Cap at 6 cards.
  results?.prepend(card);
  if (results) {
    while (results.children.length > 3) results.lastElementChild?.remove();
  }
}
// --- Robust query parsing ---
// Keep comma inside a single lat,long query. Otherwise split by newlines/semicolons.
function parseQueries(raw) {
  const latLngPattern = /^\s*-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\s*$/;
  if (latLngPattern.test(raw)) return [raw.trim()];
  return raw
    .split(/\r?\n|;/) // split on newline or semicolon
    .map(s => s.trim())
    .filter(Boolean);
}
// --- Search button handler ---
searchBtn.addEventListener("click", async () => {
  const raw = input.value.trim() || "59.3293,18.0686"; // default Stockholm
  const queries = parseQueries(raw);
  // Optional: clear previous results before rendering new batch
  // results.innerHTML = "";
  const dataList = await Promise.all(queries.map(q => checkWeather(q)));
  dataList.forEach(d => renderCard(d));
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





