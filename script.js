const API_KEY = "37cf80aeb0724a5f8bd81720250311";

const searchBtn = document.getElementById("searchBtn");
const input = document.querySelector(".search input");
const weatherIcon = document.querySelector(".weather-icon");
const cityInput = document.querySelector(".city");
const tempInput = document.querySelector(".temp");
const windInput = document.querySelector(".wind");
const humidityInput = document.querySelector(".humidity");

async function checkWeather(q) {
  try {
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(q)}&aqi=no`;
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);

    const data = await response.json();
    console.log("WeatherAPI data:", data);

    cityInput.textContent = `${data.location.name}, ${data.location.country}`;
    tempInput.textContent = `${Math.round(data.current.temp_c)}°C`;
    windInput.textContent = `${Math.round(data.current.wind_kph)} km/h`;
    humidityInput.textContent = `${data.current.humidity}%`;

    const condition = data.current.condition.text.toLowerCase();
    if (condition.includes("rain")) weatherIcon.src = "images/rain.png";
    else if (condition.includes("cloud")) weatherIcon.src = "images/clouds.png";
    else if (condition.includes("snow")) weatherIcon.src = "images/snow.png";
    else if (condition.includes("mist") || condition.includes("fog")) weatherIcon.src = "images/mist.png";
    else weatherIcon.src = "images/clear.png";
  } catch (err) {
    console.error("Could not fetch data.", err.message);
  }
}

searchBtn.addEventListener("click", () => {
  const q = input.value.trim() || "59.3293,18.0686";
  checkWeather(q);
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const q = input.value.trim() || "59.3293,18.0686";
    checkWeather(q);
  }
});

// initial load: Stockholm coords
checkWeather("59.3293,18.0686");
