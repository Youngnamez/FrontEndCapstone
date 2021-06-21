// Setup empty JS object to act as endpoint for all routes
let weatherData = {}

// Require Express to run server and routes
const express = require("express")
const bodyParser = require("body-parser")

// Start up an instance of app
const app = express();
app.use(express.static('dist')) 

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));


app.get('/getWeatherData', function(req, res) {
    console.log('server get request received. Sending weather data as')
    console.log(weatherData)
    res.send(weatherData);
});

app.post('/postWeatherData', function(req, res) {
    console.log("Server weather data is")
    console.log(req.body)

    weatherData = {
        weatherDescription: req.body.weatherDescription,
        temperature: req.body.temperature,
        windSpeed: req.body.windSpeed,
        windDirection: req.body.windDirection,
        cloudCoverage: req.body.cloudCoverage,
        date: req.body.date
    }
    console.log('weatherData is now ')
    console.log(weatherData)
})

module.exports = app