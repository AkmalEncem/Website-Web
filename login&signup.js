/* ===============================
   AVATAR COLOR GENERATOR (SAME EVERYWHERE)
================================ */
function generateAvatarColor(name) {
    const colors = [
        "#1abc9c", "#3498db", "#9b59b6",
        "#e67e22", "#e74c3c", "#2ecc71",
        "#f39c12", "#16a085", "#2980b9"
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
}

/* ===============================
   LOGIN
================================ */
function handleLogin(event) {
    event.preventDefault();

    const matric = document.getElementById('matricNumber').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorDiv = document.getElementById('errorMessage');

    const showError = (message) => {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => errorDiv.style.display = 'none', 5000);
    };

    const storedData = localStorage.getItem('user_' + matric);

    if (!storedData) {
        showError("No account found with this Matric Number. Please sign up first.");
        return;
    }

    const userData = JSON.parse(storedData);

    if (userData.password !== password) {
        showError("Incorrect password. Please check your credentials and try again.");
        return;
    }

    /* ===== SESSION DATA ===== */
    localStorage.setItem('loggedInUser', userData.name);
    localStorage.setItem('lms_matrix', userData.matric);

    /* ===== LOCK AVATAR COLOR (ONCE) ===== */
    let avatarColor = localStorage.getItem("avatarColor");
    if (!avatarColor) {
        avatarColor = generateAvatarColor(userData.name);
        localStorage.setItem("avatarColor", avatarColor);
    }

    window.location.href = "index.html";
}

/**
 * Toggles the visibility of the password field
 * @param {string} inputId - The ID of the password input element
 */
function togglePasswordVisibility(inputId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = passwordInput.nextElementSibling;

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.textContent = "🔒"; // Changes icon to a lock (or any icon you prefer)
    } else {
        passwordInput.type = "password";
        toggleIcon.textContent = "👁️"; // Changes back to eye
    }
}

/* ===============================
   SIGN UP
================================ */
function handleSignup(event) {
    event.preventDefault();

    const nameInput = document.getElementById('fullName');
    const matricInput = document.getElementById('matricNum');
    const emailInput = document.getElementById('regEmail');
    const passInput = document.getElementById('regPassword');

    const fullname = nameInput.value.trim();
    const matric = matricInput.value.trim();
    const email = emailInput.value.trim();
    const password = passInput.value.trim();

    if (!fullname || !matric || !email || !password) {
        alert("Please complete all fields.");
        return;
    }

    const userData = {
        name: fullname,
        email: email,
        matric: matric,
        password: password
    };

    /* ===== SAVE USER ===== */
    localStorage.setItem('user_' + matric, JSON.stringify(userData));
    localStorage.setItem('last_signup_matric', matric);

    /* ===== PRE-GENERATE AVATAR COLOR ===== */
    const avatarColor = generateAvatarColor(fullname);
    localStorage.setItem("avatarColor", avatarColor);

    /* ===== SUCCESS ===== */
    document.getElementById("successPopup").classList.add("active");
}

/* ===============================
   REDIRECT
================================ */
function redirectLogin() {
    window.location.href = "login.html";
}
