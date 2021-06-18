/* Global Variables */
console.log("Beginning")
let daysUntilTrip = 0;
let currentDate = new Date();
let currentTripInfo = {
    departureDate: '', 
    cityName: ''
};

document.addEventListener('DOMContentLoaded', (event) => {
    //the event occurred
    getPreviousTripInfo().then(function(previousTripData) {
        console.log("Previous trip data is ")
        console.log(previousTripData)
        updateUI(previousTripData)
        callAllAPIs()
        updateCountdown()

    })
})

async function getPreviousTripInfo () {
    console.log('Getting Previous Trip Information')
    const response = await fetch('http://localhost:8081/getTripInformation');
    try {
        const apiData = await response.json();
        return apiData;
    }
    catch(error) {
    console.log("error", error);
    }
}

function populateWeatherInfo(data) {
    console.log('populating ui weather info with')
    console.log(data)
    document.getElementById('weatherInfo').innerHTML = 
    `<p>The expected temperature is ${data.temperature}.</p>
    <p>You can expect a windspeed of ${data.windSpeed}mph going at an angle of ${data.windDirection}°.</p>
    <p>Clouds will cover ${data.cloudCoverage}% of the sky that day! :)</p>`


}

function updateUI(data) {
    console.log("In updateUI, data is")
    console.log(data)
    document.getElementById('city').value = data.cityName;
    document.getElementById('date').value = data.departureDate.replaceAll('/','-');
}

async function saveTrip(path, data) {
    console.log("Saving trip Data: ")
    console.log(data);
    const response = await fetch(path, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:8081/',
    },
    mode: 'cors',
    credentials: 'same-origin', 
    body: JSON.stringify(data),
   });
}
async function callAllAPIs() {
    const cityName = document.getElementById('city').value;
    currentTripInfo.cityName = cityName;

    getCityData(cityName)
    .then(function(cityData) {
        getWeatherBitData(cityData)
        .then(function(weatherData) {
            console.log('populating weather with')
            console.log(weatherData) //is undefined currently
            populateWeatherInfo(weatherData)
        })
    })
    
    .then(function() {
        getPixabyImage(cityName);     
    })
    .then(
        updateUI(currentTripInfo)
    )
}

function updateCountdown() {
//Got help from here: https://www.geeksforgeeks.org/how-to-calculate-the-number-of-days-between-two-dates-in-javascript/
    //Date was off by one day for some reason, but this fixed it: https://stackoverflow.com/questions/7556591/is-the-javascript-date-object-always-one-day-off
    dateItem = document.getElementById('date');
    console.log('currentTripInfo')
    console.log(currentTripInfo)
    currentTripInfo.departureDate = dateItem.value;
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    let tripDate = new Date(dateItem.value.split('-'));

    //helped from here: https://knowledge.udacity.com/questions/255771
    daysUntilTrip = Math.floor((Date.UTC(tripDate.getFullYear(), tripDate.getMonth(), tripDate.getDate()) - Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) ) /(1000 * 60 * 60 * 24));
   

    if (daysUntilTrip >= 0) {
        document.getElementById('countdownNum').innerText = daysUntilTrip;
        document.getElementById('countdown').style.visibility = 'visible';

        if (daysUntilTrip == 0) {
            document.getElementById('countdownText').innerText = "Today is the Day!! :D"
        }

        if (daysUntilTrip == 1) {
            document.getElementById('countdownText').innerText = "Your trip is on the horizon ;)"
        }

        if (daysUntilTrip > 1) {
            document.getElementById('countdownText').innerText = "Days until Trip"
        }
    }
    
    else {
        document.getElementById('countdown').style.visibility = 'hidden';
    }
}

/* Event Listeners */

document.getElementById("generate").addEventListener('click', function() {
    // leaving zip code as const variable for now
    callAllAPIs()
});

document.getElementById("date").addEventListener('change', function() {
    updateCountdown();
});


document.getElementById("save").addEventListener('click', function() {
    saveTrip("http://localhost:8081/saveTrip", currentTripInfo)
});

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
        currentTripInfo.weatherInfo = data;
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
        document.getElementById('cityView').src = apiData.hits[0].webformatURL;
      }catch(error) {
      console.log("error", error);
      // appropriately handle the error
      }
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