$(document).ready(function () {
// This is my API key
  var APIKey = "68d8ae14240405aabf44b39f20638690";

  // Function to update and retrieve search history using Local Storage
  function updateSearchHistory(city) {
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    // Add the current city to the beginning of the search history array
     // Check if the city is already in the search history
    if (!searchHistory.includes(city)) {
      searchHistory.unshift(city);
    }
    searchHistory = searchHistory.slice(0, 8); // Limit to the last 8 searches
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

    // Update the search history display on the website
    var historyContainer = $('#history');
    // Clear the existing content in the search history container
    historyContainer.empty();
    // Iterate through each item in the search history
    searchHistory.forEach(function (search) {
      // Create a button element for each search history item
      var historyItem = $('<div class="btn btn-secondary m-1 history-item">');
      // Set the text of the button to the city name
      historyItem.text(search);
      // Attach a click event listener to each history item button
      historyItem.on('click', function () {
        // On click, update weather for the clicked city
        updateWeather(search);
      });
      historyContainer.append(historyItem);
    });
  }

  // Function to convert temperature from Kelvin to Celsius
  function kelvinToCelsius(temperatureKelvin) {
    return (temperatureKelvin - 273.15).toFixed(2);
  }

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
        
        // Extract information about the current weather
        var currentDate = new Date(currentData.dt * 1000); // Extract the current date from the API response and convert it to a JavaScript Date object
        var cityName = currentData.name;
        var temperatureCelsiusCurrent = kelvinToCelsius(currentData.main.temp); // Convert the temperature from Kelvin to Celsius using the kelvinToCelsius function
        var humidity = currentData.main.humidity;
        var windSpeed = currentData.wind.speed;
        var weatherIcon = currentData.weather[0].icon;

        // Clear the existing content before appending new data
        $('#today').empty();
        // Log the additional information
        var targetDiv = $('#today');

        var cardDiv = $('<div class="card">');
        targetDiv.append(cardDiv);

        var heading = $('<h4 class="card-title p-2 font-weight-bold" id="heading">');
        heading.text(cityName + ' (' + currentDate.toLocaleDateString() + ') '); // Format the current date to a user-friendly string based on the user's locale

        var weatherIconElement = $('<img class="weather-icon" id="icon">');
        // Set the source (src) attribute of the image element
        // The source URL is dynamically constructed based on the weather icon code received from the API
        weatherIconElement.attr('src', 'https://openweathermap.org/img/w/' + weatherIcon + '.png');
        heading.append(weatherIconElement);

        var currentTemp = $('<p class="card-text p-2" id="currentTemp">');
        currentTemp.text('Temp: ' + temperatureCelsiusCurrent + ' °C');

        var currentWind = $('<p class="card-text p-2" id="currentWind">');
        currentWind.text('Wind Speed: ' + windSpeed + ' KPH');

        var currentHumidity = $('<p class="card-text p-2" id="currentHumidity">');
        currentHumidity.text('Humidity: ' + humidity + ' %');

        cardDiv.append(heading, currentTemp, currentWind, currentHumidity);

        // Update and retrieve search history using Local Storage
        updateSearchHistory(city);

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

            // Extract detailed information for each day
            var dailyInfo = [];
            // Iterate over the forecast data
            for (var i = 0; i < forecastData.list.length; i += 8) {
              // Data is provided in 3-hour intervals (24/3=8), so we skip 8 data points to get daily values
              var date = new Date(forecastData.list[i].dt * 1000);
              var temperatureCelsiusDaily = kelvinToCelsius(forecastData.list[i].main.temp);
              var humidity = forecastData.list[i].main.humidity;
              var windSpeed = forecastData.list[i].wind.speed;
              var weatherIcon = forecastData.list[i].weather[0].icon;

              dailyInfo.push({
                date: date.toLocaleDateString(),
                temperatureCelsius: temperatureCelsiusDaily,
                humidity: humidity,
                windSpeed: windSpeed,
                weatherIcon: weatherIcon
              });
            }

            // Log the collected daily information
            console.log(dailyInfo);

            // Clear the existing content before appending new data
            $('#forecast').empty();

            // Display daily information on the website
            var forecastContainer = $('#forecast');

            dailyInfo.forEach(function (dayInfo) {
              var dayContainer = $('<div class="day-container card col-lg-2 text-white m-1">');

              var dateElement = $('<p class="date">');
              dateElement.text(dayInfo.date);

              var weatherIconElement = $('<img class="weather-icon" id="icon">');
              weatherIconElement.attr('src', 'https://openweathermap.org/img/w/' + dayInfo.weatherIcon + '.png');

              var temperatureElement = $('<p class="temperature">');
              temperatureElement.text('Temp: ' + dayInfo.temperatureCelsius + ' °C');

              var windSpeedElement = $('<p class="wind-speed">');
              windSpeedElement.text('Wind: ' + dayInfo.windSpeed + ' KPH');

              var humidityElement = $('<p class="humidity">');
              humidityElement.text('Humidity: ' + dayInfo.humidity + ' %');

              dayContainer.append(dateElement, weatherIconElement, temperatureElement, windSpeedElement, humidityElement);
              forecastContainer.append(dayContainer);
            });
          });
      });
  }

  // Event listener for the search button
  $('#search-button').on('click', function (event) {
    event.preventDefault(); // Prevent default form submission behavior
    // Get the value entered in the search input field
    var city = $('#search-input').val();
    // Call the updateWeather function with the entered city as an argument
    updateWeather(city);
  });

  // Initial weather update with the default city (London)
  updateWeather('London');
});