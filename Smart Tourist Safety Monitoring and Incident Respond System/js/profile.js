// profile.js

document.addEventListener("DOMContentLoaded", function () {

    // Welcome message
    alert("Welcome to your Profile!");

    // Highlight profile card
    const profileCard = document.querySelector(".profile-card");

    if (profileCard) {
        profileCard.addEventListener("mouseover", function () {
            profileCard.style.transform = "scale(1.02)";
            profileCard.style.transition = "0.3s";
        });

        profileCard.addEventListener("mouseout", function () {
            profileCard.style.transform = "scale(1)";
        });
    }

    // Show current date
    const date = document.getElementById("currentDate");

    if (date) {
        const today = new Date();
        date.innerHTML = today.toDateString();
    }

});