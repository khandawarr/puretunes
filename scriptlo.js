
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent form submission
    
    // Get input values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple validation
    if (username.trim() === '' || password.trim() === '') {
        showError('Please fill in all fields');
        return;
    }

    // Add your authentication logic here
    // This is just a demo validation
    if (username === 'admin' && password === 'password123') {
        // Successful login
        document.body.style.backgroundColor = "#e1ffed";
        alert('Login successful!');
        // Redirect to another page
        window.location.href = 'https://example.com/dashboard';
    } else {
        showError('Invalid username or password');
    }
});

function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Hide error message after 3 seconds
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 3000);
}