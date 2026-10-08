// weather.js

document.addEventListener("DOMContentLoaded", function () {

    showWeather();

});

function showWeather(){

    document.getElementById("city").innerHTML = "Chennai";

    document.getElementById("temperature").innerHTML = "31°C";

    document.getElementById("condition").innerHTML = "☀️ Sunny";

    document.getElementById("humidity").innerHTML = "65%";

    document.getElementById("wind").innerHTML = "15 km/h";

    document.getElementById("updated").innerHTML =
        "Updated: " + new Date().toLocaleTimeString();

}

function refreshWeather(){

    showWeather();

    alert("Weather updated successfully!");

}