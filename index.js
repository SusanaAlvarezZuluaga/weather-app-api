require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const data = require('./city.list.json');
const { restart } = require('nodemon');

const apiKey = process.env.API_KEY;
const port = process.env.PORT;

const app = express();
app.use(cors());
function getAvailableCityResults(cityName, limit) {
  let resp = [];
  if (cityName !== '') {
    for (let i = 0; i < data.length && resp.length < limit; i++) {
      if (data[i].name.toLowerCase().startsWith(cityName.toLowerCase())) {
        const { id, coord, name, state, country } = data[i];
        resp.push({
          id: id,
          long: coord.lon,
          lat: coord.lat,
          name: name,
          state: state,
          country: country,
        });
      }
    }
  }
  return resp;
}
//gets cities that start with  a query parameter
app.get('/api/cities', (req, res) => {
  const { startsWith, limit } = req.query;
  const results = getAvailableCityResults(startsWith, limit);
  res.status(200).json(results);
});

//get current weather info through City ID
app.get('/api/currentWeather/:id', (req, res) => {
  const cityId = req.params.id;
  const apiUrl = `http://api.openweathermap.org/data/2.5/weather?id=${cityId}&units=metric&appid=${apiKey}`;
  axios
    .get(apiUrl)
    .then((response) => response.data)
    .then((city) => {
      const cityCurrent = {
        id: cityId,
        cityName: city.name,
        currentTemperature: city.main.temp,
        currentWeatherCondition: city.weather[0].main,
        currentWeatherDescription: city.weather[0].description,
        currentWeatherIcon: city.weather[0].icon,
      };
      res.status(200).json(cityCurrent);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).json({ message: 'Something went wrong' });
    });
});

//get weather forecast through LATITUDE and LONGITUDE

app.get('/api/weatherForecast', (req, res) => {
  const { lat, lon } = req.query;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,current&units=metric&appid=${apiKey}`;
  axios
    .get(apiUrl)
    .then((response) => {
      const utcOffset = response.data.timezone_offset;
      const hourly = response.data.hourly;
      const daily = response.data.daily;
      let hourlyReduced = hourly.map((hour, index) => ({
        id: index,
        temp: hour.temp,
        weatherCondition: hour.weather[0].main,
        weatherIcon: hour.weather[0].icon,
      }));
      hourlyReduced = hourlyReduced.slice(0, 24);
      const dailyReduced = daily.map((day, index) => ({
        id: index,
        minTemp: day.temp.min,
        maxTemp: day.temp.max,
        weatherCondition: day.weather[0].main,
        weatherIcon: day.weather[0].icon,
      }));
      const forecastInfo = {
        utcOffset: utcOffset,
        hourlyForecast: hourlyReduced,
        dailyForecast: dailyReduced,
      };
      res.status(200).json(forecastInfo);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).json({ message: 'Something went wrong' });
    });
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
