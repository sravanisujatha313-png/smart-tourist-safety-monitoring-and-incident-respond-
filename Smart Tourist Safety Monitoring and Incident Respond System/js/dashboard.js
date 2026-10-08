// dashboard.js

// Welcome message
window.onload = function () {
    alert("Welcome to the Tourist Safety Dashboard!");
    updateDateTime();
    setInterval(updateDateTime, 1000);
};

// Update current date and time
function updateDateTime() {
    const dateTime = document.getElementById("datetime");

    if (dateTime) {
        const now = new Date();
        dateTime.innerHTML = now.toLocaleString();
    }
}

// Logout confirmation
function confirmLogout() {
    return confirm("Are you sure you want to logout?");
}