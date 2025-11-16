// Auth page functionality
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const loginBox = document.querySelector('.login-box');
    const registerBox = document.querySelector('.register-box');

    // Toggle between login and register
    showRegister?.addEventListener('click', (e) => {
        e.preventDefault();
        loginBox.style.display = 'none';
        registerBox.style.display = 'block';
    });

    showLogin?.addEventListener('click', (e) => {
        e.preventDefault();
        registerBox.style.display = 'none';
        loginBox.style.display = 'block';
    });

    // Login form submission
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await authAPI.login({ email, password });
            if (response.success) {
                setAuth(response.data.token, response.data.user);
                window.location.href = 'dashboard.html';
            }
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    });

    // Register form submission
    registerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const role = document.getElementById('regRole').value;
        const contact = document.getElementById('regContact').value;

        try {
            const response = await authAPI.register({ name, email, password, role, contact });
            if (response.success) {
                setAuth(response.data.token, response.data.user);
                window.location.href = 'dashboard.html';
            }
        } catch (error) {
            const errorMessage = error.message || 'Registration failed. Please check your input and try again.';
            alert('Registration failed: ' + errorMessage);
            console.error('Registration error:', error);
        }
    });

    // Check if already logged in
    if (getToken()) {
        window.location.href = 'dashboard.html';
    }
});

