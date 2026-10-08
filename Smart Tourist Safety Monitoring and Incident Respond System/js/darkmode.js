// darkmode.js

document.addEventListener("DOMContentLoaded", function () {

    const toggleBtn = document.getElementById("darkModeBtn");

    // Load saved theme
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");

        if (toggleBtn) {
            toggleBtn.innerHTML = "☀️ Light Mode";
        }
    }

    if (toggleBtn) {

        toggleBtn.addEventListener("click", function () {

            document.body.classList.toggle("dark-mode");

            if (document.body.classList.contains("dark-mode")) {
                localStorage.setItem("theme", "dark");
                toggleBtn.innerHTML = "☀️ Light Mode";
            } else {
                localStorage.setItem("theme", "light");
                toggleBtn.innerHTML = "🌙 Dark Mode";
            }

        });

    }

});