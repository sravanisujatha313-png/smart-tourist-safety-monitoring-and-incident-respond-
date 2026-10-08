// safety.js

document.addEventListener("DOMContentLoaded", function () {

    // Show welcome message
    alert("🛡️ Welcome! Read these safety tips before you travel.");

    // Highlight safety cards on hover
    const cards = document.querySelectorAll(".safety-card");

    cards.forEach(function(card){

        card.addEventListener("mouseover", function(){
            card.style.transform = "translateY(-8px)";
            card.style.transition = "0.3s";
        });

        card.addEventListener("mouseout", function(){
            card.style.transform = "translateY(0)";
        });

    });

    // Display current date
    const date = document.getElementById("currentDate");

    if(date){
        const today = new Date();
        date.innerHTML = today.toDateString();
    }

});