// cityCoordinates to contain city & coordinates.

class CityCoordinates {
    constructor(city, longitude, latitude) {
      this._city = city;
      this._coordinates = [longitude, latitude];
    }
    // overloaded constructor for converting Open Weather Geo data into this coordinate class
    openWeatherGeoDataConstructor (rawOpenWeatherDataObject) {
      return new CityCoordinates(rawOpenWeatherDataObject[0].name,     // extract city name
                                  rawOpenWeatherDataObject[0].lon,    // extract longitude
                                  rawOpenWeatherDataObject[0].lat);  // extract latitude
    }
    // comparison method for alphabetic sorting by city name
    alphaComparison(comparisonCoordinate) {
      let thisCity = this._city;
      let thatCity = comparisonCoordinate.city;
      if (thisCity < thatCity) {
        return -1;
      } else if (thisCity == thatCity) {
        return 0;
      } else {
        return 1;
      }
    }
    // setter getters
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
      return `city: ${this._city}, longitude: ${this.longitude}, latitude: ${this.latitude}.`
    }
  }
  
  // knownCities is the list of cities with coordinates retrieved previously.
  
  class KnownCities {
    static _dataStoreName; // string to hold name of localStorage object
    static _knownCoordinates; // array to hold coordinate objects
  
    static initialize(localDataStore) {
      KnownCities._dataStoreName = localDataStore;
      KnownCities._knownCoordinates = JSON.parse(localStorage.getItem(KnownCities._dataStoreName)) || [];
    }
  
    static addCoordinate(coordinate) {
      KnownCities._knownCoordinates.push(coordinate);
    }
    static sort() {
      KnownCities._knownCoordinates.sort(function(a,b){return a.preceedsAlphabetically(b)}); // Sweet!
    } 
  
    static toString() {
      return KnownCities._knownCoordinates.map(city => city.toString()).join(" \n ");
    }
  }
  
  
  // tests cityCoordinates
  a = new CityCoordinates("Berlin", 1, 2);
  b = new CityCoordinates("Berlim", 3, 4);
  c = new CityCoordinates("Warsaw", 5, 6);
  d = new CityCoordinates("Aberdeen", 7, 8);
  console.log(a.toString());
  console.log(b.toString());
  
  
  KnownCities.initialize("localChaos");
  KnownCities.addCoordinate(a);
  KnownCities.addCoordinate(b);
  KnownCities.addCoordinate(c);
  KnownCities.addCoordinate(d);
  
  console.log(KnownCities.toString());
  KnownCities.sort();
  console.log(KnownCities.toString());
  
  console.log("string test")
  let str1 = "Berlin";
  let str2 = "Berlan";
  let str3 = "Warsaw";
  console.log("Berlin preceeds Berlan ? " + (str1<=str2));
  
  // console.log("second string test - subtraction")  //fail
  //console.log("Berlin - Berlan ? "  + (str1 - str 2));
  
  console.log("Coordinate class test - a=Berlin, b=Berlim");
  console.log("Berlin preceeds Berlim ? " + a.alphaComparison(b));
  console.log("Berlim preceeds Berlin ? " + b.alphaComparison(a));
  
  