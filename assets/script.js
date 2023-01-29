// openWeatherMap.org key and variables used to create queries
const apiKey = "e9b136f83aba716833b8671f60447800";
const limit = "2"; // limit returned names from place name request
let lat = undefined;
let lon = undefined;

// Data related variables and code
const localCities = "knownCities"; // name of locally stored cities object
let knownCities = JSON.parse(localStorage.getItem(localCities) || "[]"); // 'list' of previously searched cities - stores CityCoordinates instances

// HTML document handles
let searchHTML = document.getElementById("city-input");
let searchedListHTML = document.getElementById("city-list");
let currentWeatherHTML = document.getElementById("current-weather-here");
let fiveDayWeatherHTML = document.getElementById("five-day-forecast");

// cityCoordinates class to contain Open Weather city coordinates.
class CityCoordinates {
    constructor(coordinateData) {
        this._city = coordinateData[0].name;
        this._coordinates = [coordinateData[0].lon, coordinateData[0].lat];       
    }
    set city(cityName) {
        this._city = cityName;
    }
    set coordinates(coordinates) {
        this._coordinates = coordinates;
    }
    get city() {
        return this._city;
    }
    get longitude() {
        return this._coordinates[0];
    }
    get latitude() {
        return this._coordinates[1];
    }
    toString() {
        return `city: ${this._city}
            - longitude: ${this.longitude}
            - latitude: ${this.latitude}.`
    }
}
// WeatherReports class to contain weather reports for a page of the app
class WeatherReports {
    constructor(openWeatherData) {
        this._cityName = openWeatherData.city.name;
        // open weather returns 40 x 3-hourly weather reports for a given location
        // the class holds six evenly spaced reports to represent current and five day forecasts
        this._reports = [openWeatherData.list[0],
                        openWeatherData.list[7],
                        openWeatherData.list[15],
                        openWeatherData.list[23],
                        openWeatherData.list[31],
                        openWeatherData.list[39]];
    }
    set cityName(cityName) {
        this._cityName = cityName;
    }
    get cityName() {
        return this._cityName;
    }
    set reports(reports) {
        this._reports = reports;
    }
    get reports() {
        return this._reports;
    }
    /* Current report() the following are required from the weather object 
        i) obj.city.name -> String
        ii) obj.list[n].dt_txt - "YYYY-MM-DD HH:MM:SS"; --> converted to UK date only
        iii) obj.list[n].weather[0].icon - e.g. '01d' - icon source is `http://openweathermap.org/img/wn/${iconCode}@2x.png` using function
        iv) obj.list[n].main.temp - Celcius set in query  --> rounded
        v) obj.list[n].main.humidity
        vi) obj.list[n].speed - e.g. 3.94 units?  --> rounded - display units below guessed
    */
    get currentReport() { // not sure if this is strictly a getter - but it works
        return {
            city: this._cityName,
            date: convertDate(this._reports[0].dt_txt),
            imgSrc: createIconSrc(this._reports[0].weather[0].icon),
            temperature: Math.round(this._reports[0].main.temp),
            humidity: this._reports[0].main.humidity,
            windSpeed: Math.round(this._reports[0].wind.speed),
        }
    }
    /* forecast(1..5) : as currentReport, but without windspeed and city name,
     and with index 1..5 representing the five forecasts selected by the constructor */
    forecast(forecastIndex) {
        return {
            date: convertDate(this._reports[forecastIndex].dt_txt),
            imgSrc: createIconSrc(this._reports[forecastIndex].weather[0].icon),
            temperature: Math.round(this._reports[forecastIndex].main.temp),
            humidity: this._reports[forecastIndex].main.humidity,
           
        }
    }
}
// a couple of utility functions to format WeatherReport specific return data
// convertDate - change openWeather date and time string and return UK style date string
function convertDate(openDate) {
    // obj.list[n].dt_txt - "YYYY-MM-DD HH:MM:SS" => "DD-MM-YYYY";
    return `${openDate.slice(8,10)}-${openDate.slice(5,7)}-${openDate.slice(0,4)}`;      
}
function createIconSrc(icon) {
    //weather icon image src
    return `http://openweathermap.org/img/wn/${icon}@2x.png`
}
// LISTENERS
// refresh the search panel at the start
window.onload = (event) => {
    updateSearchedCityPanel();
  };
searchedListHTML.addEventListener("click", function(event) {
    if(event.target.tagName === 'LI') {
        createWeatherRequest(cityIsKnown(event.target.textContent)); // TODO logic a little untidy
    }
})
// LOGIC STARTS WITH TEXT INPUT CITY NAME OR CITY PIKED FROM LIST
// citySearchInput() : responds to search submit button
function citySearchInput() {
    let cityName = searchHTML.elements[0].value;    // extract input
    searchHTML.elements[0].value = "";              // clear the input field
    processCityName(cityName);
}

function processCityName(uncheckedCity) {
    let cityKnown = cityIsKnown(uncheckedCity);
    if (cityKnown) {
        console.log("city known");
        createWeatherRequest(cityKnown);
    } else {
        console.log("city not known");
        createCoordinateRequest(uncheckedCity);
    }
}
// checkIfCityIsKnown(string) loop through the array of stored cityname and coordsinate object
// return the coordinate object if it matches the name, else return false
function cityIsKnown(cityString) {
    let cityKnown = false;
    for(let city of knownCities) {
        if(city.city === cityString) {
            cityKnown = city;
        }
    }
    return cityKnown;
}
// createCoodinateRequest(city name string) : create a coordinate request string and pass it on to the specific fetch procedure
function createCoordinateRequest(unknownCity) {
    let apiGeocodingDirectCall = `http://api.openweathermap.org/geo/1.0/direct?q=${unknownCity}&limit=${limit}&appid=${apiKey}`;
    fetchCoordinates(apiGeocodingDirectCall);
}
// fetch coordinates
function fetchCoordinates(queryURL) {
    fetch(queryURL)
        .then(response => response.json())
        .then(coordinateData => processCoordinates(coordinateData));
}
// process coordinate data object returned from openWeather Geolocation query
function processCoordinates(rawCoordinates) {
    console.log(rawCoordinates);
    let newCoordinates = new CityCoordinates(rawCoordinates); // create object to contain the data we want {name, longitude, latitude}
    addToKnownCities(newCoordinates);       // add coordinates to the list and storage
    createWeatherRequest(newCoordinates);
}
// addToKnownCities(OpenWeatherCoordinate object - push onto array of known, restore knwn, refresh panel)
function addToKnownCities(cityCoordinates) { // TODO two types of cityCoordinates - requires overloaded contructor
    knownCities.push({city: cityCoordinates.city,
                    longitude: cityCoordinates.longitude,
                    latitude: cityCoordinates.latitude,
                });
    localStorage.setItem(localCities, JSON.stringify(knownCities));
    updateSearchedCityPanel();
    }
function updateSearchedCityPanel() {
    let freshSearchPanel = createSearchedCityPanelHTMLString();
    searchedListHTML.innerHTML = "";    // clear the panel
    searchedListHTML.innerHTML = freshSearchPanel; // refresh
}
// createWeatherReport(CityCoordinates object) : create a forecast request string and pass it on to the specific fetch procedure
function createWeatherRequest(coordinatesObject) {
    let lon = coordinatesObject.longitude;
    let lat = coordinatesObject.latitude;
    let apiWeatherCall = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetchWeather(apiWeatherCall);
}
// fetch weather
function fetchWeather(queryURL) {
    fetch(queryURL)
        .then(response => response.json())
        .then(weatherData => processWeather(weatherData));
}
// processWeather(data object returned from OpenWeather query) :  
function processWeather(rawWeatherData) {
    let fiveDayReport = new WeatherReports(rawWeatherData); // WeatherReports class constructor extracts pertinent data
    todaysWeather(fiveDayReport);
    fiveDaysWeather(fiveDayReport);

}
function todaysWeather(weatherReport) {
    let currentReport = weatherReport.currentReport;
    let currentWeatherHTMLString = createCurrentWeatherPanel(currentReport); // WeatherReports method creates HTML string for the current weather panel     
    currentWeatherHTML.innerHTML = "";                                              // clear the current weather panel
    currentWeatherHTML.innerHTML = currentWeatherHTMLString;                        // set the current weather panel
}
// createCurrentWeatherPanel(tailored-current-weather-data) create HTML elements string to be inserted .innnerHTL into current weather panel
function createCurrentWeatherPanel(currentWeatherObject) {
    return `<p>${currentWeatherObject.city} ${currentWeatherObject.date}</p>
            <img src="${currentWeatherObject.imgSrc}">          
            <p><span>Temp : ${currentWeatherObject.temperature}°C</span>
            <p>humidity : ${currentWeatherObject.humidity}%</p>
            <p>wind speed : ${currentWeatherObject.windSpeed}m/s</p>`
}
function createSearchedCityPanelHTMLString() {
    let panel = "";
    for(let city of knownCities) {
        panel += `<li>${city.city}</li>`;
    }
    return panel;
}

// Sorry code, dead code, tears and revived code below
/* test local storage */
// let test = new VisitedCities;
// console.log(test);
/*
Want:
a) Current
    i) city name,
    ii) date,
    iii) icon representing the weather,
    iv) temperature,
    v) humidity,
    vi) wind speed.
b) Five-days
    ii) date,
    iii) icon,
    iv) temperature,
    v) humidity.

the following are required from the weather object 
i) obj.city.name -> String
ii) obj.list[n].dt_txt - "YYYY-MM-DD HH:MM:SS";
iii) obj.list[n].weather[0].icon - e.g. '01d'
    icon source is `http://openweathermap.org/img/wn/${iconCode}@2x.png`
iv) obj.list[n].main.temp - Celcius set in query
v) obj.list[n].main.humidity
vi) obj.list[n].speed - e.g. 3.94 units?


obj.list[40] -> 40 * 3 hourly forecasts 120/24 = 5 day
[0] - [8] - [16] - [24] - [32] - [40] - 6 casts

obj.list[n].clouds.all - 0..100;

obj.list[n].wind.deg - e.g.46 direction? degrees

obj.list[n].weather[0].main - e.g. "clear"

LocalStorage
initialise - get local or not
add to
check for inclusion
Class

/*

// better test this

/* too much
// class to encapsulate data and code for the locally stored coordinates of previously searched cities
class VisitedCities {
    /* visited cities maintains the locally stored list and the same list as an instance of the code running
    it might be better there is only be the locally stored array, retrieved, changed, original deleted, and new restored each time?
    /* static list?
 /* initialise - i.e. load or save empty list
    search(city) -> false or coordinateObject
    add(coordinateobject) --> retrive list, delete from storage, add to list, save to local
    retrive() --> to create list panel 
    (local storage key - value string pair - JSON stringify -> <- parse )
    constructor() {
        this._knownCoordinates = JSON.parse(localStorage.getItem(knownCities) || "[]"); // recall a saved array or create a fresh one
    }
    set knownCoordinates(coordinatesArray) {
        this._knownCoordinates = coordinatesArray;
    }
    get knownCoordinates() {
        return this._knownCoordinates;
    }
    // add a known unknown city to th earray - somewhat confusing double handling with app variable and local stored entities the same
    add(cityCoordinate) {
        this._knownCoordinates.push(cityCoordinate);
        localStorage.removeItem(knownCities);   // erase the old locally stored array
        localStorage.setItem(knownCities, JSON.stringify(this._knownCoordinates)); // replace with the appneded array
    }
    
    toString() { 
        return `${this._knownCoordinates.map(city => city.toString).join(" and ")}`;
    }
}
*/