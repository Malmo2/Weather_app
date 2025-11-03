const CITIES = [
    { name: "Stockholm", country: "SE", lat: 59.3293, lon: 18.0686 },
    { name: "Göteborg", country: "SE", lat: 57.7089, lon: 11.9746 },
    { name: "Malmö", country: "SE", lat: 55.6050, lon: 13.0038 },
    { name: "Uppsala", country: "SE", lat: 59.8586, lon: 17.6389 },
    { name: "Lund", country: "SE", lat: 55.7047, lon: 13.1910 },
];

const WEATHER = {
    "59.3293,18.0686": { temp: 7, icon: "clouds" },
    "57.7089,11.9746": { temp: 8, icon: "rain" },
    "55.6050,13.0038": { temp: 9, icon: "clear" },
    "59.8586,17.6389": { temp: 6, icon: "mist" },
    "55.7047,13.1910": { temp: 8, icon: "clouds" },
};

const city = document.querySelector(".city");
const temp = document.querySelector(".temp");
const icon = document.querySelector(".weather-icon");
const button = document.getElementById("searchBtn");

let index = 0;

function showCity() {
    const c = CITIES[index];
    const key = `${c.lat.toFixed(4)},${c.lon.toFixed(4)}`;
    const w = WEATHER[key];
    city.textContent = c.name;
    temp.textContent = w.temp + "°C";
    icon.src = "images/" + w.icon + ".png";
}

button.addEventListener("click", function () {
    index = (index + 1) % CITIES.length;
    showCity();
});

showCity();
