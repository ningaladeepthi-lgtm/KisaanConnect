document.addEventListener('DOMContentLoaded', () => {
    // Initial Setup
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const authSlider = document.getElementById('auth-slider');
    const btnLogin = document.getElementById('btn-login');
    const btnSignup = document.getElementById('btn-signup');
    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');
    const notificationArea = document.getElementById('notification-area');
    const notificationMessage = document.getElementById('notification-message');

    // Toggle logic is exposed globally so inline onclick works
    window.toggleAuthMode = function(mode) {
        // Clear all errors
        document.querySelectorAll('.error-msg').forEach(el => {
            el.textContent = '';
            el.classList.remove('show');
        });
        
        notificationArea.classList.add('hidden');

        if (mode === 'login') {
            loginForm.classList.add('active-form');
            signupForm.classList.remove('active-form');
            
            btnLogin.classList.add('active');
            btnSignup.classList.remove('active');
            
            authSlider.style.transform = 'translateX(0)';
            
            formTitle.textContent = 'Welcome Back';
            formSubtitle.textContent = 'Enter your details to access your account.';
        } else {
            signupForm.classList.add('active-form');
            loginForm.classList.remove('active-form');
            
            btnSignup.classList.add('active');
            btnLogin.classList.remove('active');
            
            authSlider.style.transform = 'translateX(100%)';
            
            formTitle.textContent = 'Create Account';
            formSubtitle.textContent = 'Join KisanConnect to buy or sell crops directly.';
        }
    };

    // Helper to show errors
    const showError = (id, message) => {
        const errorEl = document.getElementById(`error-${id}`);
        if(errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('show');
        }
    };

    // Helper to check standard phone format (10 digits)
    const isValidPhone = (phone) => {
        return /^[0-9]{10}$/.test(phone);
    };

    // Helper to check standard pin format (4 digits)
    const isValidPin = (pin) => {
        return /^[0-9]{4}$/.test(pin);
    };

    // Login Form Submit
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Reset errors
        document.querySelectorAll('#login-form .error-msg').forEach(el => {
            el.textContent = '';
            el.classList.remove('show');
        });

        const phone = document.getElementById('login-phone').value.trim();
        const pin = document.getElementById('login-pin').value.trim();
        let isValid = true;

        if (!isValidPhone(phone)) {
            showError('login-phone', 'Please enter a valid 10-digit phone number');
            isValid = false;
        }

        if (!isValidPin(pin)) {
            showError('login-pin', 'PIN must be a 4-digit number');
            isValid = false;
        }

        if (isValid) {
            // Get selected category
            const category = document.querySelector('input[name="category"]:checked').value;
            const loginName = document.getElementById('login-name').value.trim();
            const loginLocation = document.getElementById('login-location').value.trim();
            
            // Show loading state
            const btn = document.getElementById('login-submit-btn');
            btn.textContent = 'Authenticating...';
            btn.disabled = true;

            // Save/Overwrite user to localStorage so prototype shows correct name
            const user = { 
                name: loginName || "Ammu", 
                phone: phone, 
                location: loginLocation || "Hyderabad", 
                category: category 
            };
            localStorage.setItem('kisan_user', JSON.stringify(user));

            alert("Logged in successfully!");

            // Simulate API call
            setTimeout(() => {
                window.location.href = category === 'farmer' ? 'farmer-dashboard.html' : 'wholesaler-dashboard.html';
            }, 500);
        } else {
            alert("Please provide valid login details.");
        }
    });

    // Signup Form Submit
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Reset errors
        document.querySelectorAll('#signup-form .error-msg').forEach(el => {
            el.textContent = '';
            el.classList.remove('show');
        });

        const name = document.getElementById('signup-name').value.trim();
        const phone = document.getElementById('signup-phone').value.trim();
        const location = document.getElementById('signup-location').value.trim();
        const pin = document.getElementById('signup-pin').value.trim();
        const confirmPin = document.getElementById('signup-confirm-pin').value.trim();
        const terms = document.getElementById('terms-checkbox').checked;

        let isValid = true;

        if (name.length < 3) {
            showError('signup-name', 'Name must be at least 3 characters');
            isValid = false;
        }

        if (!isValidPhone(phone)) {
            showError('signup-phone', 'Please enter a valid 10-digit phone number');
            isValid = false;
        }

        const locationRegex = /^[A-Za-z\s]+$/;
        if (location.length < 3 || !locationRegex.test(location)) {
            showError('signup-location', 'City name must be at least 3 letters and contain only alphabets');
            isValid = false;
        }

        if (!isValidPin(pin)) {
            showError('signup-pin', 'PIN must be a 4-digit number');
            isValid = false;
        }

        if (pin !== confirmPin) {
            showError('signup-confirm-pin', 'PINs do not match');
            isValid = false;
        }

        if (!terms) {
            alert("You must agree to the Terms of Service.");
            isValid = false;
        }

        if (isValid) {
            // Get selected category
            const category = document.querySelector('input[name="category"]:checked').value;

            // Show loading state
            const btn = document.getElementById('signup-submit-btn');
            btn.textContent = 'Creating Account...';
            btn.disabled = true;

            // Save user to localStorage
            const user = { name: name, phone: phone, location: location, category: category };
            localStorage.setItem('kisan_user', JSON.stringify(user));

            alert("Account created successfully!");

            // Simulate API call
            setTimeout(() => {
                window.location.href = category === 'farmer' ? 'farmer-dashboard.html' : 'wholesaler-dashboard.html';
            }, 500);
        } else {
            alert("Please fix the errors in the form.");
        }
    });
});

// Seed Initial Data to LocalStorage if empty
if (!localStorage.getItem('kisan_crops')) {
    const defaultCrops = [
        { id: 1, type: 'Wheat', quantity: 50, price: 2150, quality: 'Premium', location: 'Pune', seller: 'Ramesh Kumar' },
        { id: 2, type: 'Onion', quantity: 120, price: 1800, quality: 'Standard', location: 'Nashik', seller: 'Santosh Patil' }
    ];
    localStorage.setItem('kisan_crops', JSON.stringify(defaultCrops));
}
