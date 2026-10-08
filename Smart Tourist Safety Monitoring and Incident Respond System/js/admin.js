// admin.js

document.addEventListener("DOMContentLoaded", function () {

    // Welcome message
    alert("Welcome Admin!");

    // Highlight table rows
    const rows = document.querySelectorAll("table tbody tr");

    rows.forEach(function(row){

        row.addEventListener("mouseover", function(){
            row.style.backgroundColor = "#e3f2fd";
        });

        row.addEventListener("mouseout", function(){
            row.style.backgroundColor = "";
        });

    });

    // Show current date and time
    const date = document.getElementById("currentDate");

    if(date){
        setInterval(function(){
            const now = new Date();
            date.innerHTML = now.toLocaleString();
        },1000);
    }

});