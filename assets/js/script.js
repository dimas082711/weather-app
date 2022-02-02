var city = [];
var cityNameInputEl = document.querySelector("#city");
var searchBtnEl = document.querySelector("#search-btn");
var currentWeatherEl = document.querySelector("#current-weather");
var fiveDayForecastEl = document.getElementById("five-day-forecast");
var searchHistory = document.querySelector("#search-history");
var lat = 0;
var lon = 0;
var cityHistory = [];

var formSubmitHandler = function (event) {
  event.preventDefault();
  city = cityNameInputEl.value.trim();

  if (!city) {
    alert("Please Enter a City");
  }
  fetchCity();
};

var fetchCity = function () {
  var fetchCityAPI =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=9197ee3604a9600f19d345148a6daee6";

  fetch(fetchCityAPI)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
           if (data.length === 0) {
             alert("Please Enter a valid City");
           } else {
            lat = data.coord.lat;
            lon = data.coord.lon;
            fetchWeather(city);
            savedCity(city);
          }
        });
       } 
   })
    .catch(function (error) {
      alert("Unable to Connect To Weather APP");
    });
};

var fetchWeather = function () {
  var weatherApi =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&exclude=minutely,hourly&appid=9197ee3604a9600f19d345148a6daee6";
  fetch(weatherApi)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      while (currentWeatherEl.hasChildNodes()) {
        currentWeatherEl.removeChild(currentWeatherEl.firstChild);
      }
      while (fiveDayForecastEl.hasChildNodes()) {
        fiveDayForecastEl.removeChild(fiveDayForecastEl.firstChild);
      }

      var dt = new Date(data.current.dt * 1000);
      var returnDate = dt.toLocaleString().split(",");
      returnDate = returnDate[0];

      var currentWeatherDate = document.createElement("h2");
      currentWeatherDate.innerHTML = city + " (" + returnDate + ")";

      var currentIcon = document.createElement("img");
      currentIcon.src =
        "https://openweathermap.org/img/wn/" +
        data.current.weather[0].icon +
        "@2x.png";

      var currentTemp = document.createElement("p");
      currentTemp.innerHTML = "Temperature:" + data.current.temp + " °F";

      var currentWind = document.createElement("p");
      currentWind.innerHTML = "Wind: " + data.current.wind_speed + " MPH";

      var currentHumidity = document.createElement("p");
      currentHumidity.innerHTML = "Humidity: " + data.current.humidity + " %";

      var currentUVIndex = document.createElement("p");
      currentUVIndex.innerHTML = "UV Index: ";
      var indexSpan = document.createElement("span");
      currentUVIndex.append(indexSpan);
      indexSpan.innerHTML = data.current.uvi;
      indexSpan.classList.add(
        "text-white",
        "font-weight-bold",
        "px-3",
        "rounded"
      );
      if (data.current.uvi < 3) {
        indexSpan.classList.add("bg-success");
      } else if (data.current.uvi < 6) {
        indexSpan.classList.add("bg-warning");
      } else if (data.current.uvi < 8) {
        indexSpan.classList.add("orange");
      } else if (data.current.uvi < 11) {
        indexSpan.classList.add("bg-danger");
      } else {
        indexSpan.classList.add("purple");
      }

      currentWeatherEl.append(
        currentWeatherDate,
        currentIcon,
        currentTemp,
        currentWind,
        currentHumidity,
        currentUVIndex
      );

      for (var i = 1; i < 6; i++) {
        var fiveDayDiv = document.createElement("div");
        fiveDayDiv.setAttribute("id", "five-day-div" + [i]);
        fiveDayDiv.classList.add("col-2", "bg-primary", "text-light", "m-2");
        fiveDayForecastEl.append(fiveDayDiv);

        var dtDaily = new Date(data.daily[i].dt * 1000);
        var returnDateDaily = dtDaily.toLocaleString().split(",");
        returnDateDaily = returnDateDaily[0];

        var fiveDayDay = document.createElement("p");
        fiveDayDay.innerHTML = returnDateDaily;

        var fiveDayIcon = document.createElement("img");
        fiveDayIcon.src =
          "https://openweathermap.org/img/wn/" +
          data.daily[i].weather[0].icon +
          "@2x.png";

        var fiveDayTemp = document.createElement("p");
        fiveDayTemp.innerHTML = "Temp: " + data.daily[i].temp.day + " °F";

        var fiveDayWind = document.createElement("p");
        fiveDayWind.innerHTML = "Wind: " + data.daily[i].wind_speed + " MPH";

        var fiveDayHumidity = document.createElement("p");
        fiveDayHumidity.innerHTML =
          "Humidity: " + data.daily[i].humidity + " %";
        document
          .getElementById("five-day-div" + [i])
          .append(
            fiveDayDay,
            fiveDayIcon,
            fiveDayTemp,
            fiveDayWind,
            fiveDayHumidity
          );
      }
    });
};

var savedCity = function (city) {
  loadCity();
  for (var i = 0; i < cityHistory.length; i++) {
    if (cityHistory[i].city === city) {
      cityHistory.splice([i], 1);
      break;
    }
  }

  cityHistory.push({"city": city });
  localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
  displayCity();
};

var loadCity = function () {
  cityHistory = JSON.parse(localStorage.getItem("cityHistory"));
  if (!cityHistory) {
    cityHistory = [];
  }
};

var displayCity = function () {
  loadCity();
  while (searchHistory.hasChildNodes()) {
    searchHistory.removeChild(searchHistory.firstChild);
  };

  for (var i = cityHistory.length - 1; i >= 0; i--) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.name = "formBtn";
    btn.classList.add(
      "btn",
      "btn-primary",
      "mx-auto",
      "m-2",
      "d-grid",
      "gap-2",
      "col"
    );
    btn.innerHTML = cityHistory[i].city;
    btn.value = cityHistory[i].city;

    searchHistory.append(btn);
    btn.addEventListener("click", cityClick);
  }
};

function cityClick() {
  city = this.value;
  fetchCity();
}

searchBtnEl.addEventListener("click", formSubmitHandler);
displayCity();
