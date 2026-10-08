// ==========================================
// Smart Tourist Safety System
// Login & Registration Validation
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("form");

    if (!form) return;

    form.addEventListener("submit", function (e) {

        clearErrors();

        let valid = true;

        // =========================
        // Name Validation (Register)
        // =========================

        const name = document.querySelector("input[name='name']");

        if (name) {

            if (name.value.trim().length < 3) {

                showError(name, "Name must contain at least 3 characters.");

                valid = false;
            }

        }

        // =========================
        // Email Validation
        // =========================

        const email = document.querySelector("input[name='email']");

        if (email) {

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email.value.trim())) {

                showError(email, "Enter a valid email address.");

                valid = false;
            }

        }

        // =========================
        // Phone Validation (Register)
        // =========================

        const phone = document.querySelector("input[name='phone']");

        if (phone) {

            const phonePattern = /^[0-9]{10}$/;

            if (!phonePattern.test(phone.value.trim())) {

                showError(phone, "Enter a valid 10-digit phone number.");

                valid = false;
            }

        }

        // =========================
        // Password Validation
        // =========================

        const password = document.querySelector("input[name='password']");

        if (password) {

            if (password.value.length < 6) {

                showError(password, "Password must be at least 6 characters.");

                valid = false;
            }

        }

        // =========================
        // Confirm Password Validation
        // =========================

        const confirm = document.querySelector("input[name='confirm_password']");

        if (confirm && password) {

            if (password.value !== confirm.value) {

                showError(confirm, "Passwords do not match.");

                valid = false;
            }

        }

        // =========================
        // Prevent Submit if Invalid
        // =========================

        if (!valid) {

            e.preventDefault();

        }

    });

});


// ==========================================
// Display Error
// ==========================================

function showError(input, message) {

    const error = document.createElement("small");

    error.className = "error";

    error.innerText = message;

    input.parentElement.appendChild(error);

}


// ==========================================
// Remove Old Errors
// ==========================================

function clearErrors() {

    const errors = document.querySelectorAll(".error");

    errors.forEach(error => error.remove());

}