const ws = new WebSocket('ws://localhost:8080');
const api_key = "96037c484248338934d947852d3bed82";
const timeSlider = document.querySelector('#timeSlider');
const timeEmoji = document.querySelector('#timeicon');
const fullweatherdataUIitem = document.querySelector('#fullweatherdata');

function getContinentData(coordinates) {
    const point = turf.point([coordinates[1], coordinates[0]]); // Turf.js uses [lon, lat]

    for (const feature of geojsonData.features) {
        if (turf.booleanPointInPolygon(point, feature)) {
            return {
                country: feature.properties.name,    // Country name
                continent: feature.properties.continent // Continent name
            };
        }
    }
    return { country: "Unknown", continent: "Unknown" };
}

async function getWeatherData(coordinates, timeTravel=0) {
    if (timeTravel == 0) {
        try {
            response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates[0].toFixed(2)}&lon=${coordinates[1].toFixed(2)}&appid=${api_key}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Data not found');
                } else if (response.status === 500) {
                    throw new Error('Server error');
                } else {
                    throw new Error('Network response was not ok');
                }
            }
    
            const data = await response.json();
            return [data, true, coordinates]; // Directly return the parsed JSON data
        } catch (error) {
            console.error('Error:', error);
            return null; // Return null if an error occurs
        }
    } else {
        try {
            response = await fetch(`https://history.openweathermap.org/data/2.5/history/city?lat=${coordinates[0].toFixed(2)}&lon=${coordinates[1].toFixed(2)}&type=hour&start=${parseInt((Date.now()/1000)-86400*timeTravel)}&cnt=1&appid=${api_key}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Data not found');
                } else if (response.status === 500) {
                    throw new Error('Server error');
                } else {
                    throw new Error('Network response was not ok');
                }
            }

            const data = await response.json();
            return [data, false, coordinates]; // Directly return the parsed JSON data
        } catch (error) {
            console.error('Error:', error);
            return null; // Return null if an error occurs
        }
    }
}

function formatDataAsHTML(data) {
    let html = "";
    for (const key in data) {
        if (typeof data[key] === "object" && data[key] !== null) {
            html += `<b>${key}</b><br>`;
            for (const subKey in data[key]) {
                html += `${subKey}: ${data[key][subKey]}<br>`;
            }
        } else {
            html += `<b>${key}</b>: ${data[key]}<br>`;
        }
    }
    return html;
}

function sendWeatherData(data) {
    fullweatherdataUIitem.innerHTML = formatDataAsHTML(data);
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data, null, 4));
        // console.log('Sent data: ' + JSON.stringify(data, null, 4).split("\n").slice(0, 5).join("\n") + " ...........");
        console.log('Sent data: ' + JSON.stringify(data, null, 4));
    } else {
        console.log('WebSocket not open. Message failed to send.');
    }
}

// Function to update coordinates display
function updateLatLonUI(coordinates) {
    document.querySelector('#latlon').innerHTML = 
        (timeSlider.value == 0 ? '<b>Today</b>' : '<b>Days Ago:</b> ' + timeSlider.value) + '<br>' +
        // '<b>Latitude:</b> ' + coordinates[0].toFixed(2) + '<br>' +
        // '<b>Longitude:</b> ' + coordinates[1].toFixed(2);
        
        '&#129517; (' + coordinates[0].toFixed(2) + ', ' + coordinates[1].toFixed(2) + ')';
}

function updateLocationUI(location) {
    if (location["country"] != "Unknown") {
        document.querySelector('#location').innerHTML = "&#128205; " + location["country"] + ' ' + countryEmoji[location["country"]] + ', ' + location["continent"]; 
    } else {
        document.querySelector('#location').innerHTML = "<p style='font-size: 35px; transform: translate(0, -50px);'>&#128676;</p>"; 
    } 
}

function mapAngleToValue(angle) {
    // Normalize the angle to a 0-360 degree range
    const normalizedAngle = angle % 360;
    // Convert angle to radians
    const radians = ((normalizedAngle - 45) * Math.PI) / 180;
    // Calculate the mapped value using a sine function
    const value = Math.sin(radians);
    return value;
}


async function updateUI() {
    coordinates = getCoordinates();
    updateLatLonUI(coordinates);
    timeEmoji.style.transform = 'translate(0, -'+ (14 /*+ (mapAngleToValue(timeSlider.value))*/) + 'px) rotate(' + (90 + (timeSlider.value / 365 * 720)) +'deg)';
    updateLocationUI(getContinentData(coordinates));
}

// UI
map.on('move', updateUI);

timeSlider.addEventListener('input', updateUI);

updateUI();

// Data
async function getAndSendData() {
    const [data, current, coordinates] = await getWeatherData(getCoordinates(), timeSlider.value);
    sendWeatherData(beautifyData(data, current, coordinates, getContinentData(coordinates)));
}

timeSlider.addEventListener('change', getAndSendData);

map.on('moveend', getAndSendData);

getAndSendData();

function openFullscreen() {
    if (document.body.requestFullscreen) {
        document.body.requestFullscreen();
    } else if (document.body.webkitRequestFullscreen) { /* Safari */
        document.body.webkitRequestFullscreen();
    } else if (document.body.msRequestFullscreen) { /* IE11 */
        document.body.msRequestFullscreen();
    }
    document.querySelector("#fullscreenButton").style.opacity = 0;
}

document.addEventListener('fullscreenchange', function() {
    if (!document.fullscreenElement) {
        // Exit fullscreen mode
        document.querySelector("#fullscreenButton").style.opacity = 1;
    }
});

function showFullWeather() {
    if (fullweatherdataUIitem.style.display == "block") {
        fullweatherdataUIitem.style.display = "none";
    } else {
        fullweatherdataUIitem.style.display = "block";
    }
    
}

document.querySelector("#weatherDataUI").addEventListener("click", showFullWeather);

document.querySelector("#fullscreenButton").addEventListener("click", openFullscreen);