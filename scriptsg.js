const form = document.getElementById('signupForm');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirmPassword');
const strengthBar = document.getElementById('strengthBar');

// Password strength checker
passwordInput.addEventListener('input', function() {
    const strength = checkPasswordStrength(this.value);
    strengthBar.style.width = strength.percentage + '%';
    strengthBar.style.backgroundColor = strength.color;
});

// Form submission handler
form.addEventListener('submit', function(e) {
    e.preventDefault();
    clearErrors();
    const form = document.getElementById('signupForm');
    const successPage = document.getElementById('successPage');
    const fullName = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmInput.value.trim();

    let isValid = true;

    // Name validation
    if (fullName === '') {
        showError('nameError', 'Please enter your full name');
        isValid = false;
    }

    // Email validation
    if (!validateEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }

    // Password validation
    const passwordCheck = checkPasswordStrength(password);
    if (password.length < 8) {
        showError('passwordError', 'Password must be at least 8 characters');
        isValid = false;
    } else if (passwordCheck.score < 3) {
        showError('passwordError', 'Password is too weak');
        isValid = false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
        showError('confirmError', 'Passwords do not match');
        isValid = false;
    }

    if (isValid) {
        // Submit form (you would add your submission logic here)
        alert('Sign up successful!');
        form.reset();
        strengthBar.style.width = '0%';
    }

    if (isValid) {
        // Hide form and show success page
        document.querySelector('.signup-container').style.display = 'none';
        successPage.style.display = 'flex'; // Use 'flex' to match container's display
        document.body.style.background = "#292929"; // Optional: change background
        
        // Optional: Add fade animation
        successPage.style.animation = 'fadeIn 0.5s ease';
    }
});

function checkPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;

    const colors = ['#e74c3c', '#f1c40f', '#2ecc71', '#27ae60', '#218c53'];
    const percentages = [20, 40, 60, 80, 100];
    
    return {
        score: score,
        percentage: percentages[score],
        color: colors[score]
    };
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearErrors() {
    const errors = document.getElementsByClassName('error-message');
    for (let error of errors) {
        error.style.display = 'none';
    }
}