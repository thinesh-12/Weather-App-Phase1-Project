const API_KEY = "329e2e01620207d2f696cc29145ce137";
let searchInput, searchBtn, locationE, temperatureE, descriptionE, humidityE, windSpeedE, forecastE;

document.addEventListener("DOMContentLoaded", () => {
  searchInput = document.getElementById("search-input");
  searchBtn = document.getElementById("search-btn");
  locationE = document.getElementById("location");
  temperatureE = document.getElementById("temperature");
  descriptionE = document.getElementById("description");
  humidityE = document.getElementById("humidity");
  windSpeedE = document.getElementById("wind-speed");
  forecastE = document.getElementById("forecast");

  searchBtn.addEventListener("click", () => {
    const city = searchInput.value;

    getWeatherData(city);
  });

  // Event listener for Enter key 
  searchInput.addEventListener("keyup", (event) => {
    if(event.key === "Enter") {
      getWeatherData(city);

    }
  });
});


async function getWeatherData(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
  const data = await response.json();

  // Extract relevant weather data from the API response
  const location = data.name;
  const temperature = data.main.temp;
  const description = data.weather[0].description;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;

  // Update the weather display on the UI
  locationE.textContent = location;
  temperatureE.textContent = `${temperature}°C`;
  descriptionE.textContent = description;
  humidityE.textContent = `Humidity: ${humidity}%`;
  windSpeedE.textContent = `Wind speed: ${windSpeed} m/s`;


  // Get the forecast data
  const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`);
  const forecastData = await forecastResponse.json();


  // Filter out the forecast data for the start of each day (at midnight)
  const filteredForecastData = forecastData.list.filter(entry => entry.dt_txt.endsWith("00:00:00"));
  document.getElementById("forecast").innerHTML = "";
  
  // Loop through the filtered forecast data and display each day's weather
  filteredForecastData.forEach(day => {
    const date = new Date(day.dt * 1000);
    const dayName = date.toLocaleDateString(undefined, { weekday: 'long' });
    const temp = Math.round(day.main.temp - 273.15);
    const desc = day.weather[0].description;
    const weatherConditionCode = day.weather[0].id;
    const forecastItem = document.createElement("div");
    forecastItem.classList.add("forecast-item");
    forecastItem.innerHTML = `
      <div class="forecast-day">${dayName}</div>      
      <div class="forecast-temp">${temp}°C</div>
      <div class="forecast-desc">${desc}</div>
    `;
    forecastE.appendChild(forecastItem);
  });
}
