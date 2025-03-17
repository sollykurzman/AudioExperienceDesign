// Initialize the map centered on London
var latitude = 51.505;
var longitude = -0.09;

var map = L.map('map').setView([latitude, longitude], 5);

// Add the OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

function correctCoords(coordinate, maxRange) {
    let range = maxRange * 2;
    return ((coordinate + maxRange) % range + range) % range - maxRange;
}

function getCoordinates() {
    let center = map.getCenter();
    latitude = correctCoords(center.lat, 90);
    longitude = correctCoords(center.lng, 180);
    return [latitude, longitude]
}

