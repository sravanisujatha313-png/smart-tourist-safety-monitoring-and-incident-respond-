// contacts.js

document.addEventListener("DOMContentLoaded", function () {

    // Welcome message
    alert("📞 Emergency Contacts are ready to use.");

    // Hover effect for contact cards
    const cards = document.querySelectorAll(".contact-card");

    cards.forEach(function(card){

        card.addEventListener("mouseover", function(){
            card.style.transform = "translateY(-8px)";
            card.style.transition = "0.3s";
        });

        card.addEventListener("mouseout", function(){
            card.style.transform = "translateY(0)";
        });

    });

    // Show current date
    const date = document.getElementById("currentDate");

    if(date){
        date.innerHTML = new Date().toDateString();
    }

});