// openWeatherMap.org key and variables used to create queries
const apiKey = "e9b136f83aba716833b8671f60447800";
const limit = "10";
let lat = undefined;
let lon = undefined;

// Data related variables and code
let knownCities = [];

// HTML document handles
let search = document.getElementById("city-input");

// cityCoordinates class to contain Open Weather city coordinates.
class CityCoordinates {
    constructor(coordinateData) {
        this._city = coordinateData[0].name;
        this._country = coordinateData[0].country;
        this._coordinates = [coordinateData[0].lon, coordinateData[0].lat];       
    }
    // original constructor
    // constructor(city, country, longitude, latitude) {
    //     this._city = city;
    //     this._country = country;
    //     this._coordinates = [longitude, latitude];
    // }
    set city(cityName) {
        this._city = cityName;
    }
    set country(countryName) {
        this._country = countryName;
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
            - country ${this._country}
            - longitude: ${this.longitude}
            - latitude: ${this.latitude}.`
    }
}
// WeatherReports class to contain weather reports fpr a page of th eapp
// construct using the object.list array of 40 three-hour reports returned by a query
class WeatherReports {
//    constructor(cityName, [...openWeatherList]) {
    //    this._cityName = cityName;
    constructor(openWeatherData) {
        this._cityName = openWeatherData.city.name;
        this._reports = [openWeatherData.list[0],
                        openWeatherData.list[7],
                        openWeatherData.list[15],
                        openWeatherData.list[23],
                        openWeatherData.list[31],
                        openWeatherData.list[39]];
    }
    // constructor(cityName, openWeatherList) {
    //     console.log(`constructing weather report`)
    //     this._cityName = cityName;
    //     this._reports = [openWeatherList[0],
    //                     openWeatherList[7],
    //                     openWeatherList[15],
    //                     openWeatherList[23],
    //                     openWeatherList[31],
    //                     openWeatherList[39]];
    // }
    set cityName(cityName) {        // unsure of the need for setters and getters w.r.t. constructor?
        this._cityName = cityName;  // had an error when playing but may have misinterpreted the same
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
    /* Current report
        the following are required from the weather object 
        i) obj.city.name -> String
        ii) obj.list[n].dt_txt - "YYYY-MM-DD HH:MM:SS";
        iii) obj.list[n].weather[0].icon - e.g. '01d'
            icon source is `http://openweathermap.org/img/wn/${iconCode}@2x.png`
        iv) obj.list[n].main.temp - Celcius set in query
        v) obj.list[n].main.humidity
        vi) obj.list[n].speed - e.g. 3.94 units?
    */
    get currentReport() {
        // TODO - sanitise the weather 
        // round temperature and wind speed
        return {
            city: this._cityName,
            date: this._reports[0].dt_txt,
            imgSrc: this._reports[0].weather[0].icon,
            temperature: this._reports[0].main.temp,
            humidity: this._reports[0].main.humidity,
            windSpeed: this._reports[0].wind.speed,
        }
    }
    toString() {
        return `report: ${this._reports}`;  // test with single report
    }

}
// convertDate - change openWeather date and time string and return UK style date string
function convertDate(openDate) {
// [TODO] 
    return `openDate`;      
}
function createIconSrc(icon) {
// [TODO]
    return `icon image lookup string`
}
// citySearch() : responds to search submit button
function citySearchInput() {
    let cityName = search.elements[0].value;    // extract input
    processCityName(cityName);
}
// processCityName : test if a coordinate request is required
function processCityName(uncheckedCity) {
//    console.log(`unchecked city : ${uncheckedCity}`);
    // [TODO] logic here to test if it exists
    createCoordinateRequest(uncheckedCity);

}
// create 
function createCoordinateRequest(unknownCity) {
//    console.log(`unknown city : ${unknownCity}`);
    let apiGeocodingDirectCall = `http://api.openweathermap.org/geo/1.0/direct?q=${unknownCity}&limit=${limit}&appid=${apiKey}`;
//    console.log(`coordinate api : ${apiGeocodingDirectCall}`);
    fetchCoordinates(apiGeocodingDirectCall);
}
function createWeatherRequest(coordinatesObject) {
    let lon = coordinatesObject.longitude;
    let lat = coordinatesObject.latitude;
    let apiWeatherCall = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetchWeather(apiWeatherCall);
}
// fetch coordinates
function fetchCoordinates(queryURL) {
    fetch(queryURL)
        .then(response => response.json())
        .then(coordinateData => processCoordinates(coordinateData));
}
// or fetch weather
function fetchWeather(queryURL) {
    fetch(queryURL)
        .then(response => response.json())
        .then(weatherData => processWeather(weatherData));
}

function processCoordinates(rawCoordinates) {
//    console.log(rawCoordinates);
// [TODO] - this should better be done in the constructor !! This is the new construction call !!
    let newCoordinates = new CityCoordinates(rawCoordinates);
    // let newCoordinates = new CityCoordinates(
    //     rawCoordinates[0].name,
    //     rawCoordinates[0].country,
    //     rawCoordinates[0].lon,
    //     rawCoordinates[0].lat);
    console.log(newCoordinates.toString());
    createWeatherRequest(newCoordinates);
}
function testArrayPass(test) {
    console.log(test[0]);
}
function processWeather(rawWeatherData) {
//    console.log(rawWeatherData);
//    let report = new WeatherReports(rawWeatherData.city.name, rawWeatherData.list);
    let report = new WeatherReports(rawWeatherData);
    // console.log(report.cityName);
    // console.log(report.reports);
//    testArrayPass(rawWeatherData.list);
    console.log(report.currentReport);
}

// test cityCoordinates
/*
a = new CityCoordinates("London", "GB", 1, 2);
b = new CityCoordinates("Paris", "FR", 3, 4);
console.log("class cityCoordinate : " + a.toString());
console.log("class cityCoordinate : " + b.toString());


/*
Want:
a) Current
    i) city name,
    ii) date,
    iii) icon representing the weather,
    iv) temeprature,
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


*/