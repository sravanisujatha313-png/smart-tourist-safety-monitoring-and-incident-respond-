const API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjI3YmQ0ZjdlNWQ4YjRjOWNhODNkNGU3OTg0NWU0OWIzIiwiaCI6Im11cm11cjY0In0=";

let map;
let userMarker;
let routeLine;

// Map Initialize
window.onload = function () {

    // Default Map (Hyderabad)
    map = L.map('map').setView([17.3850, 78.4867], 10);

    // OpenStreetMap Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap Contributors'
    }).addTo(map);

    // Current Location Automatically
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(

            function(position) {

                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                // Current Location input box
                document.getElementById("currentLocation").value =
                    lat + "," + lng;

                // Move Map
                map.setView([lat, lng], 13);

                // Marker
                userMarker = L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup("Your Current Location")
                    .openPopup();

            },

            function(error) {

                alert("Location Permission Denied.");

            }

        );

    } else {

        alert("Geolocation is not supported.");

    }

};


async function findRoute() {

    const current = document.getElementById("currentLocation").value.trim();
    const destination = document.getElementById("destination").value.trim();
    const result = document.getElementById("routeResult");

    if (current === "" || destination === "") {
        alert("Please enter destination.");
        return;
    }

    const currentParts = current.split(",");

    const startLat = parseFloat(currentParts[0]);
    const startLng = parseFloat(currentParts[1]);


    const geoURL =
        `https://api.openrouteservice.org/geocode/search?api_key=${API_KEY}&text=${encodeURIComponent(destination)}`;

    const geoResponse = await fetch(geoURL);
    const geoData = await geoResponse.json();

    if (!geoData.features || geoData.features.length === 0) {
        alert("Destination not found.");
        return;
    }

    const endLng = geoData.features[0].geometry.coordinates[0];
    const endLat = geoData.features[0].geometry.coordinates[1];

    drawRoute(startLat, startLng, endLat, endLng);
}



async function drawRoute(startLat, startLng, endLat, endLng) {

    const url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson";

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            coordinates: [
                [startLng, startLat],
                [endLng, endLat]
            ]
        })
    });

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
        alert("Route not found.");
        return;
    }

    // Remove old route
    if (routeLine) {
        map.removeLayer(routeLine);
    }

    // Draw new route
    routeLine = L.geoJSON(data).addTo(map);

    map.fitBounds(routeLine.getBounds());

    const summary = data.features[0].properties.summary;

    const distance = (summary.distance / 1000).toFixed(2);
    const duration = (summary.duration / 60).toFixed(0);

    document.getElementById("routeResult").innerHTML = `
        <strong>✅ Safe Route Found</strong><br><br>
        📏 Distance: ${distance} km<br>
        ⏱️ Duration: ${duration} minutes<br><br>
        🚓 Stay on main roads.<br>
        🏥 Keep nearby hospitals in mind.<br>
        📱 Share your live location with trusted contacts.
    `;
}