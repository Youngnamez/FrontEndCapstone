// Setup empty JS object to act as endpoint for all routes
let tripData = {
    departureDate: '2021/07/04', 
    cityName: 'Paris',
    // description: 'Overcast Clouds',
    // temperature:  85.1,
    // windSpeed:  13.7,
    // windDirection:  187,
    // cloudCoverage:  10
};

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


// Setup Server
app.listen(8081, function() {
    console.log("server running on port 8081");
});

app.get("/getTripInformation", function getWeatherData(req, res) {
    console.log("made it to server")

   res.send(tripData);
});

app.post("/saveTrip", function (req, res) {
    tripData.departureDate = req.body.departureDate;
    tripData.cityName = req.body.cityName;
    // tripData.temperature = req.body.weatherInfo.temperature;
    // tripData.windSpeed = req.body.weatherInfo.windSpeed;
    // tripData.windDirection = req.body.weatherInfo.windDirection;
    // tripData.cloudCoverage = req.body.weatherInfo.cloudCoverage;
    console.log('The saved server trip data is now:');
    console.log(tripData)
    res.send(tripData)
});

