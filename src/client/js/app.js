import {updateCountdown} from '../js/updateCountdown'

/* Global Variables */
let daysUntilTrip = 0;


document.addEventListener('DOMContentLoaded', (event) => {
    
    /* Event Listeners */
    document.getElementById("generate").addEventListener('click', function() {
        // leaving zip code as const variable for now
        if (document.getElementById('date').value == '' || document.getElementById('city').value == '') {
            alert('All fields must be filled in order to generate.')
            return;
        }
        else {
            callAllAPIs()
        }
    });

    document.getElementById("date").addEventListener('change', function() {
        
        daysUntilTrip = updateCountdown();
    });
    //the event occurred
    getPreviousInfo()
})

function getPreviousInfo () {
    document.getElementById('city').value = localStorage.getItem('city') != null ? localStorage.getItem('city') : '';
    if (localStorage.getItem('date')) {
        document.getElementById('date').value = (localStorage.getItem('date'));
        daysUntilTrip = updateCountdown();
    }
    
    document.getElementById('cityView').src = localStorage.getItem("imageLink") ? localStorage.getItem("imageLink") : '';
    localStorage.getItem("weatherInfo") ? updateWeatherUI(JSON.parse(localStorage.getItem("weatherInfo"))) : null;
}

function updateWeatherUI(weatherData) {
    document.getElementById('weatherInfo').innerHTML = 
    `<p>⦾ The expected temperature is ${weatherData.temperature}.</p>
    <p>⦾ You can expect a windspeed of ${weatherData.windSpeed}mph going at an angle of ${weatherData.windDirection}°.</p>
    <p>⦾ Clouds will cover ${weatherData.cloudCoverage}% of the sky that day! :)</p>`
}

async function getWeatherInformation(path) {
    console.log("Getting weatherData from server")
    const response = await fetch(path);
    //some work to update the UI
    try {
        const apiData = await response.json();
        console.log("server weatherData is")
        console.log(apiData)
       return apiData;
      }catch(error) {
      console.log("error", error);
      // appropriately handle the error
      }
}

async function callAllAPIs() {
    const cityName = document.getElementById('city').value;
    localStorage.setItem('city', cityName);

    getCityData(cityName)
    .then(function(cityData) {
        getWeatherBitData(cityData)
        .then(function(weatherData) {
        })
    })
    
    .then(getPixabyImage(cityName))
    .then(function() {
        console.log('got pixaby')
        getWeatherInformation('http://localhost:8081/getWeatherData')
        .then(function(weatherData) {
            updateWeatherUI(weatherData)
        })
    })
 
}


/* API Calls */
async function getCityData (cityName) {
    console.log("Calling GeoNames with link: " + getGeoNameAPIUrl(cityName));
    const response = await fetch(getGeoNameAPIUrl(cityName));
    try {
        const apiData = await response.json();
        let data = {
            longitude: apiData.postalCodes[0].lng,
            latitude: apiData.postalCodes[0].lat,
            country: apiData.postalCodes[0].countryCode
        }
        return data;
    }
    catch(error) {
    console.log("error", error);
    }
}

async function getWeatherBitData (data) {
    console.log('Calling WeatherBit with link: ' + getWeatherBitAPIUrl(data))
    const response = await fetch(getWeatherBitAPIUrl(data));

    try {
        const apiData = await response.json();
        let positionToGet = daysUntilTrip - 1;
        if (daysUntilTrip <= 7) {
            positionToGet = 0;
        }

        else if (daysUntilTrip > 16) {
            positionToGet = 15;
        }
        let desiredForcast = apiData.data[positionToGet];
        const data = {
            weatherDescription: desiredForcast.weather.description,
            temperature: desiredForcast.temp,
            windSpeed: desiredForcast.wind_spd,
            windDirection: desiredForcast.wind_dir,
            cloudCoverage: desiredForcast.clouds,
            date: desiredForcast.datetime
        }

        localStorage.setItem('weatherInfo', JSON.stringify(data));
        console.log(localStorage)
        console.log("local storage weatherInfo is")
        console.log(localStorage.getItem('weatherInfo'))
        postWeatherData(data);
        return data;
    }
    catch (error) {
        console.log("error", error)
    }
}

async function getPixabyImage(cityName) {
    console.log("Calling Pixaby with link: " + getPixabyAPIUrl(cityName))
    const response = await fetch(getPixabyAPIUrl(cityName));
    //some work to update the UI
    try {
        const apiData = await response.json();
        console.log("web data")
        console.log(apiData);
        console.log("inside pixaby")
        const imageLink = apiData.hits[0].largeImageURL;
        document.getElementById('cityView').src = imageLink;
        localStorage.setItem("imageLink", imageLink);
       return imageLink;
      }catch(error) {
      console.log("error", error);
      // appropriately handle the error
      }
}

async function postWeatherData(weatherData) {
    console.log('weatherData')
    const response = await fetch("http://localhost:8081/postWeatherData", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:8000/',
        },
        mode: 'cors',
        credentials: 'same-origin', 
        body: JSON.stringify(weatherData),
       });


}

/* Helper Functions */
function getGeoNameAPIUrl(city) {
    // http://api.geonames.org/postalCodeSearchJSON?placename=orange&username=netienne
    const username = "netienne";
    return "http://api.geonames.org/postalCodeSearchJSON?placename=" + city + "&maxRows=10&username=" + username;
}

function getWeatherBitAPIUrl(data) {
    // https://api.weatherbit.io/v2.0/current?lat=35.7796&lon=-78.6382&key=API_KEY&include=minutely
    // https://api.weatherbit.io/v2.0/forecast/daily?lat=35.7796&lon=-78.6382&key=cf24d889e63f4f8dbbb9c6a4a5dc8bd4
    const weatherbitKey = 'cf24d889e63f4f8dbbb9c6a4a5dc8bd4';
    
    const weatherbitURLCurrent = 'http://api.weatherbit.io/v2.0/current';
    const weatherbitURLFuture = 'http://api.weatherbit.io/v2.0/forecast/daily';

    const neededWeather = (daysUntilTrip <= 7) ? weatherbitURLCurrent : weatherbitURLFuture;

    let forcastDays = (daysUntilTrip > 16) ? 16 : daysUntilTrip;

    const formatLongAndLat = "?lat=" + data.latitude + "&lon=" + data.longitude;

    const daysFormat = "&days=" + forcastDays;
    return neededWeather + formatLongAndLat + daysFormat + "&units=I&key=" + weatherbitKey;
}

function getPixabyAPIUrl(query) {
    // https://pixabay.com/api/?key=22111585-105c24ed5d8be70d11c3dd1f4&q=yellow+flowers&image_type=photo
    const pixabyKey = '22111585-105c24ed5d8be70d11c3dd1f4';
    const formatQuery = "&q=" + query.replaceAll(' ', '+');

    return "https://pixabay.com/api/?key=" + pixabyKey + formatQuery + "&image_type=photo";
}

export {callAllAPIs}