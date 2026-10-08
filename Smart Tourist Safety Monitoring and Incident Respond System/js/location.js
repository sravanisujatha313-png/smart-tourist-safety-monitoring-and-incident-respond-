// location.js

document.addEventListener("DOMContentLoaded", function () {
    getLocation();
});

function getLocation() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by your browser.");
    }

}

function showPosition(position) {

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    document.getElementById("lat").textContent = latitude.toFixed(6);
    document.getElementById("lon").textContent = longitude.toFixed(6);

    document.getElementById("mapLink").href =
        "https://www.google.com/maps?q=" + latitude + "," + longitude;

}

function showError(error) {

    switch (error.code) {

        case error.PERMISSION_DENIED:
            alert("Location access was denied.");
            break;

        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;

        case error.TIMEOUT:
            alert("Location request timed out.");
            break;

        default:
            alert("An unknown error occurred.");
    }

}