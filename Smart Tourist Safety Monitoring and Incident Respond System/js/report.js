// report.js

document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("form");

    form.addEventListener("submit", function (event) {

        const name = document.querySelector('input[name="name"]').value.trim();
        const location = document.querySelector('input[name="location"]').value.trim();
        const incident = document.querySelector('select[name="incident_type"]').value;
        const description = document.querySelector('textarea[name="description"]').value.trim();

        if (name === "" || location === "" || incident === "" || description === "") {
            alert("Please fill in all required fields.");
            event.preventDefault();
            return;
        }

        if (description.length < 10) {
            alert("Description should contain at least 10 characters.");
            event.preventDefault();
            return;
        }

        alert("✅ Incident Report Submitted Successfully!");
    });

});