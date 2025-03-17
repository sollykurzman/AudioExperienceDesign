let sea_level = 1000;
let grnd_level = 1000;

function beautifyData(data, current, coordinates, locationData) {
    let rain = [0.0, 0.0];
    let snow = [0.0, 0.0];
    let gust = 0.0;
    const continents = [
        "Ocean",
        "Africa",
        "Antarctica",
        "Asia",
        "Oceania",
        "Europe",
        "North America",
        "South America"
    ];
    let continent = "Ocean";
    let country = "";
    if (current && data?.["wind"]?.["gust"]) {
        gust = data["wind"]["gust"];
    } else if (current) {
        gust = (data["wind"]["speed"]*1.5).toFixed(2);
    } else {
        gust = (data["list"][0]["wind"]["speed"]*1.5).toFixed(2);
    }
    if (current && data?.["rain"]) {
        rain = [data["rain"]["1h"],(data["rain"]["1h"]*3).toFixed(2)];
    } else if (data?.["list"]?.[0]?.["rain"]) {
        if (data?.["list"]?.[0]?.["rain"]?.["3h"]) {
            rain = [data["list"][0]["rain"]["1h"], data["list"][0]["rain"]["3h"]];
        } else {
            rain = [data["list"][0]["rain"]["1h"], (data["list"][0]["rain"]["1h"]*3).toFixed(2)];
        } 
    }
    if (current && data?.["snow"]) {
        snow = [data["snow"]["1h"],(data["snow"]["1h"]*3).toFixed(2)];
    } else if (data?.["list"]?.[0]?.["snow"]) {
        if (data?.["list"]?.[0]?.["snow"]?.["3h"]) {
            snow = [data["list"][0]["snow"]["1h"], data["list"][0]["snow"]["3h"]];
        } else {
            snow = [data["list"][0]["snow"]["1h"], (data["list"][0]["snow"]["1h"]*3).toFixed(2)];
        }
    }
    if (locationData["continent"] != "Unknown") {
        continent = locationData["continent"]
        country = locationData["country"]
    }

    if (data?.["main"]?.["sea_level"] != null || data?.["list"]?.[0]?.["main"]?.["sea_level"] != null) {
        sea_level = current? data["main"]["sea_level"]:data["list"][0]["main"]["sea_level"];
    }

    if (data?.["main"]?.["grnd_level"] != null || data?.["list"]?.[0]?.["main"]?.["grnd_level"] != null) {
        grnd_level = current? data["main"]["grnd_level"]:data["list"][0]["main"]["grnd_level"];
    }

    hot_data = {
        "location": {
            "lat": parseFloat(coordinates[0].toFixed(2)),
            "lon": parseFloat(coordinates[1].toFixed(2)),
            "continent": continent,
            "continentCode": continents.indexOf(continent),
            "country": country
        },
        "weather": {
            "main": current? data["weather"][0]["main"]:data["list"][0]["weather"][0]["main"],
            "description": current? data["weather"][0]["description"]:data["list"][0]["weather"][0]["description"]
        },
        "temp": {
            "temp": current? data["main"]["temp"]:data["list"][0]["main"]["temp"],
            "feels_like": current? data["main"]["feels_like"]:data["list"][0]["main"]["feels_like"],
            "temp_min": current? data["main"]["temp_min"]:data["list"][0]["main"]["temp_min"],
            "temp_max": current? data["main"]["temp_max"]:data["list"][0]["main"]["temp_max"],
        },
        "wind": {
            "speed": current? data["wind"]["speed"]:data["list"][0]["wind"]["speed"],
            "deg": current? data["wind"]["deg"]:data["list"][0]["wind"]["deg"],
            "gust": gust,
        },
        "clouds": {
            "all": current? data["clouds"]["all"]:data["list"][0]["clouds"]["all"]
        },
        "rain": {
            "1h": rain[0],
            "3h": rain[1],
        },
        "snow": {
            "1h": snow[0],
            "3h": snow[1],
        },
        "weatherOther": {
            "pressure": current? data["main"]["pressure"]:data["list"][0]["main"]["pressure"],
            "humidity": current? data["main"]["humidity"]:data["list"][0]["main"]["humidity"],
            "sea_level": sea_level,
            "grnd_level": grnd_level,
            "visibility": current? data["visibility"]:10000,
        }
    }
    return hot_data
}

