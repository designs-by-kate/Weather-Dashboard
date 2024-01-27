// This is our API key
var APIKey = "68d8ae14240405aabf44b39f20638690";

// Function to update weather based on user input
function updateWeather(city) {
  // Build the URL for the current weather data
  var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

  // Fetch the current weather data
  fetch(currentWeatherURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (currentData) {
      // Log the current weather data
      console.log(currentData);

      // Extract information about the current weather
      var currentDate = new Date(currentData.dt * 1000);
      var cityName = currentData.name;
      var temperature = currentData.main.temp;
      var humidity = currentData.main.humidity;
      var windSpeed = currentData.wind.speed;
      var weatherIcon = currentData.weather[0].icon;

      // Log the additional information
      var targetDiv = $('#today');

      var cardDiv = $('<div class="card">');
      targetDiv.append(cardDiv);

      var heading = $('<h5 class="card-title" id="heading">');
      heading.text(cityName + ' ' + currentDate.toLocaleDateString() + ' ' + weatherIcon);

      var currentTemp = $('<p class="card-text" id="currentTemp">');
      currentTemp.text('Temperature: ' + temperature)
      var currentWind = $('<p class="card-text" id="currentWind">');
      currentWind.text('Wind Speed: ' + windSpeed)
      var currentHumidity = $('<p class="card-text" id="currentHumidity">');
      currentHumidity.text('Humidity: ' + humidity)
      cardDiv.append(heading, currentTemp, currentWind, currentHumidity);

      // Extract latitude and longitude for the forecast
      var lat = currentData.coord.lat;
      var lon = currentData.coord.lon;

      // Build the URL for the 5-day forecast
      var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

      // Fetch the 5-day forecast data
      fetch(fiveDayURL)
        .then(function (response) {
          return response.json();
        })
        .then(function (forecastData) {
          // Log the 5-day forecast data
          console.log(forecastData);

          // Extract detailed information for each day
          var dailyInfo = [];
          for (var i = 0; i < forecastData.list.length; i += 8) {
            // Data is provided in 3-hour intervals, so we skip 8 data points to get daily values
            var date = new Date(forecastData.list[i].dt * 1000);
            var temperature = forecastData.list[i].main.temp;
            var humidity = forecastData.list[i].main.humidity;
            var windSpeed = forecastData.list[i].wind.speed;
            var weatherIcon = forecastData.list[i].weather[0].icon;

            dailyInfo.push({
              date: date.toLocaleDateString(),
              temperature: temperature,
              humidity: humidity,
              windSpeed: windSpeed,
              weatherIcon: weatherIcon
            });
          }

          // Log the collected daily information
          console.log(dailyInfo);
        });
    });
}

// Event listener for the search button
$('#search-button').on('click', function (event) {
  event.preventDefault(); // Prevent default form submission behavior
  var city = $('#search-input').val();
  updateWeather(city);
});

// Initial weather update with the default city (London)
updateWeather('London');