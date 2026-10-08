// ================================
// Smart Tourist Safety System
// script.js
// ================================

// Wait until page is loaded
document.addEventListener("DOMContentLoaded", () => {

    console.log("Smart Tourist Safety System Loaded Successfully!");

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", function (e) {

            e.preventDefault();

            const target = document.querySelector(this.getAttribute("href"));

            if (target) {
                target.scrollIntoView({
                    behavior: "smooth"
                });
            }

        });
    });

    // Welcome message
    setTimeout(() => {
        console.log("Welcome to Smart Tourist Safety System");
    }, 1000);

});


// ================================
// Navbar Shadow
// ================================

window.addEventListener("scroll", () => {

    const header = document.querySelector("header");

    if (window.scrollY > 50) {

        header.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";

    } else {

        header.style.boxShadow = "none";

    }

});


// ================================
// Reveal Cards While Scrolling
// ================================

const cards = document.querySelectorAll(".card");

window.addEventListener("scroll", revealCards);

function revealCards() {

    const trigger = window.innerHeight * 0.85;

    cards.forEach(card => {

        const top = card.getBoundingClientRect().top;

        if (top < trigger) {

            card.style.opacity = "1";
            card.style.transform = "translateY(0px)";

        }

    });

}

cards.forEach(card => {

    card.style.opacity = "0";
    card.style.transform = "translateY(40px)";
    card.style.transition = "0.7s";

});

revealCards();


// ================================
// Scroll To Top Button
// ================================

const topButton = document.createElement("button");

topButton.innerHTML = "↑";

topButton.id = "topButton";

document.body.appendChild(topButton);

topButton.style.position = "fixed";
topButton.style.bottom = "25px";
topButton.style.right = "25px";
topButton.style.width = "50px";
topButton.style.height = "50px";
topButton.style.border = "none";
topButton.style.borderRadius = "50%";
topButton.style.background = "#0b3d91";
topButton.style.color = "white";
topButton.style.fontSize = "22px";
topButton.style.cursor = "pointer";
topButton.style.display = "none";
topButton.style.zIndex = "999";

window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {

        topButton.style.display = "block";

    } else {

        topButton.style.display = "none";

    }

});

topButton.addEventListener("click", () => {

    window.scrollTo({

        top: 0,
        behavior: "smooth"

    });

});


// ================================
// Active Navigation Highlight
// ================================

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 120;

        if (window.scrollY >= sectionTop) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});


// ================================
// Hero Button Animation
// ================================

const heroButton = document.querySelector(".hero-btn");

if (heroButton) {

    heroButton.addEventListener("mouseenter", () => {

        heroButton.style.transform = "scale(1.08)";
        heroButton.style.transition = "0.3s";

    });

    heroButton.addEventListener("mouseleave", () => {

        heroButton.style.transform = "scale(1)";

    });

}\