// register.js

document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("form");

    form.addEventListener("submit", function (event) {

        const username = document.querySelector('input[name="username"]').value.trim();
        const email = document.querySelector('input[name="email"]').value.trim();
        const password = document.querySelector('input[name="password"]').value.trim();

        if (username === "" || email === "" || password === "") {
            alert("Please fill in all fields.");
            event.preventDefault();
            return;
        }

        if (!email.includes("@")) {
            alert("Please enter a valid email address.");
            event.preventDefault();
            return;
        }

        if (password.length < 6) {
            alert("Password must contain at least 6 characters.");
            event.preventDefault();
            return;
        }

        alert("Registration Successful!");
    });

});