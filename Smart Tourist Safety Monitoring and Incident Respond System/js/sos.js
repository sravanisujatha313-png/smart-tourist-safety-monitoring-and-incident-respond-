// sos.js

document.addEventListener("DOMContentLoaded", function () {

    const sosButton = document.getElementById("sosBtn");

    if (sosButton) {
        sosButton.addEventListener("click", sendSOS);
    }

});

function sendSOS() {

    const status = document.getElementById("status");

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    status.innerHTML = "📍 Fetching your location...";

    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude = position.coords.latitude.toFixed(6);
            const longitude = position.coords.longitude.toFixed(6);

            status.innerHTML =
                "<h3 style='color:green;'>✅ SOS Alert Sent Successfully!</h3>" +
                "<p><strong>Latitude:</strong> " + latitude + "</p>" +
                "<p><strong>Longitude:</strong> " + longitude + "</p>";

            alert("🚨 Emergency SOS Alert Sent!");

            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);

        },

        function (error) {

            switch (error.code) {

                case error.PERMISSION_DENIED:
                    alert("Location permission denied.");
                    break;

                case error.POSITION_UNAVAILABLE:
                    alert("Location unavailable.");
                    break;

                case error.TIMEOUT:
                    alert("Location request timed out.");
                    break;

                default:
                    alert("Unknown error occurred.");
            }

            status.innerHTML =
                "<span style='color:red;'>❌ Unable to send SOS.</span>";

        }

    );

}