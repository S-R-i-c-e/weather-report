// openWeatherMap.org
const apiKey = "e9b136f83aba716833b8671f60447800";
const limit = "10";
let lat;
let lon;
let apiWeatherCall = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

// Data related variables and code
let knownCities = [];

// HTML document handles
let search = document.getElementById("city-input");

// cityCoordinates to contain Open Weather city coordinates.
class CityCoordinates {
    constructor(city, country, longitude, latitude) {
        this._city = city;
        this._country = country;
        this._coordinates = [longitude, latitude];
    }

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



// citySearch() : responds to search submit button
function citySearchInput() {
    let cityName = search.elements[0].value;
    processCityName(cityName);
}

function processCityName(uncheckedCity) {
    console.log(`unchecked city : ${uncheckedCity}`);
    // [TODO] logic here to test if it exists
    createCoordinateRequest(uncheckedCity);

}

function createCoordinateRequest(unknownCity) {
    console.log(`unknown city : ${unknownCity}`);
    let apiGeocodingDirectCall = `http://api.openweathermap.org/geo/1.0/direct?q=${unknownCity}&limit=${limit}&appid=${apiKey}`;
    console.log(`coordinate api : ${apiGeocodingDirectCall}`);
    fetchCoordinates(apiGeocodingDirectCall);
}

function fetchCoordinates(queryURL) {
    fetch(queryURL)
        .then(response => response.json())
        .then(coordinateData => processCoordinates(coordinateData));
}

function processCoordinates(rawCoordinates) {
    console.log(rawCoordinates);
    let newCoordinates = new CityCoordinates(
        rawCoordinates[0].local_names[rawCoordinates[0].country],
        rawCoordinates[0].country,
        rawCoordinates[0].lon,
        rawCoordinates[0].lat);
    console.log(newCoordinates.toString());
}

// test cityCoordinates
a = new CityCoordinates("London", "GB", 1, 2);
b = new CityCoordinates("Paris", "FR", 3, 4);
console.log("class cityCoordinate : " + a.toString());
console.log("class cityCoordinate : " + b.toString());
