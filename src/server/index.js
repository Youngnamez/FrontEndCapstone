// Setup empty JS object to act as endpoint for all routes
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

