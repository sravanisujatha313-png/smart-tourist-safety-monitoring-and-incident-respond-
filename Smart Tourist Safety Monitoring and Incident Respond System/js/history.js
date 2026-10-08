// history.js

document.addEventListener("DOMContentLoaded", function () {

    const table = document.querySelector("table");
    const rows = table.querySelectorAll("tbody tr, tr");

    // Subtract header row
    const reportCount = rows.length - 1;

    const heading = document.querySelector(".container h1");

    if (heading) {
        heading.innerHTML = `📋 Incident History (${reportCount})`;
    }

    if (reportCount <= 0) {
        const msg = document.createElement("p");
        msg.textContent = "No incident reports found.";
        msg.style.textAlign = "center";
        msg.style.fontSize = "18px";
        msg.style.color = "red";
        table.style.display = "none";
        document.querySelector(".container").appendChild(msg);
    }

});