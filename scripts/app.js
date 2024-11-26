const API_KEY = 'your_api_key_here';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';

const searchButton = document.getElementById('search-button');
const currentLocationButton = document.getElementById('current-location');
const toggleUnitButton = document.getElementById('toggle-unit');

let isCelsius = true;

async function fetchWeather(city) {
    const response = await fetch(`${BASE_URL}weather?q=${city}&units=${isCelsius ? 'metric' : 'imperial'}&appid=${API_KEY}`);
    const data = await response.json();
    displayCurrentWeather(data);
}

function displayCurrentWeather(data) {
    document.getElementById('location').innerText = `${data.name}, ${data.sys.country}`;
    document.getElementById('temperature').innerText = `${data.main.temp}°${isCelsius ? 'C' : 'F'}`;
    document.getElementById('weather-status').innerText = data.weather[0].description;
    document.getElementById('min-max-temp').innerText = `Min: ${data.main.temp_min}° | Max: ${data.main.temp_max}°`;
    document.getElementById('wind-speed').innerText = `Wind: ${data.wind.speed} km/h`;
    document.getElementById('current-time').innerText = new Date().toLocaleTimeString();
}

searchButton.addEventListener('click', () => {
    const city = document.getElementById('search-city').value;
    if (city) fetchWeather(city);
});

toggleUnitButton.addEventListener('click', () => {
    isCelsius = !isCelsius;
    toggleUnitButton.innerText = isCelsius ? 'Switch to °F' : 'Switch to °C';
});

// Fetch weather for default or current location
