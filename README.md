# Weather App API

This project contains the back-end code for a weather app. Specifically, a RESTful API is created using Express.js and the code can be found in the [index.js](https://github.com/SusanaAlvarezZuluaga/weather-app-api/blob/master/index.js) file

- The API has endpoints to retrieve information about the current weather condition in different cities of the world as well as hourly forecasts and daily forecasts.
- In this API the data was retrieved by using [OpenWeather's API](https://openweathermap.org)
- The API developed in this repository is used in the front-end of a weather app to retrieve data and display it.

## How to this project it in your computer

1. Clone this repository
2. Run the command npm install in your terminal. This will install in your project folder all the packages used in this project.
3. Access [OpenWeather's API](https://openweathermap.org) and create a user to get a key
4. Create a .env file and put your api key and the port where you want to start the server. This .env file should include the following two variables:
   API_KEY=
   PORT=
5. Run the command npm start or npm run dev to start the server
