// openWeatherMap.org
const apiKey = "e9b136f83aba716833b8671f60447800";
const limit = "10";
let lat;
let lon;
let cityName;
let apiWeatherCall = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
let apiGeocodingDirectCall = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${apiKey}`;


// HTML document handles
let search = document.getElementById("city-input");


function citySearch() {
    let cityName = search.elements[0].value;
    console.log(cityName);
}