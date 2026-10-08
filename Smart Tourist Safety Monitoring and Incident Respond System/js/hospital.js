// hospital.js

document.addEventListener("DOMContentLoaded", function () {
    findHospital();
});

function findHospital() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by your browser.");
    }

}

function showPosition(position) {

    const latitude = position.coords.latitude.toFixed(6);
    const longitude = position.coords.longitude.toFixed(6);

    document.getElementById("lat").textContent = latitude;
    document.getElementById("lon").textContent = longitude;

    document.getElementById("hospitalMap").href =
        "https://www.google.com/maps/search/hospitals/@" +
        latitude + "," + longitude + ",15z";

}

function showError(error) {

    switch (error.code) {

        case error.PERMISSION_DENIED:
            alert("Location permission denied.");
            break;

        case error.POSITION_UNAVAILABLE:
            alert("Location information unavailable.");
            break;

        case error.TIMEOUT:
            alert("Location request timed out.");
            break;

        default:
            alert("An unknown error occurred.");
    }

}