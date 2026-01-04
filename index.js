/* ===============================
   SESSION & BASIC DATA
================================ */
const name = localStorage.getItem("loggedInUser");
const matrix = localStorage.getItem("lms_matrix") || "CI250026";

/* ===============================
   BADGE & PAYMENT MENU (UPDATED)
================================ */
function updateHomeNoti(){
    const courses = JSON.parse(localStorage.getItem("selectedCourses")) || [];
    const count = courses.length;

    const badge = document.getElementById("courseBadge");
    const paymentMenu = document.getElementById("paymentMenu");

    if(badge && paymentMenu){
        if(count > 0){
            badge.style.display = "inline-block";
            badge.textContent = `+${count}`;
            paymentMenu.innerHTML = `Payment <span style="color:red;">(${count})</span>`;
        }else{
            badge.style.display = "none";
            paymentMenu.textContent = "Payment";
        }
    }
}

/* ===============================
   USER INFO DISPLAY
================================ */
if (document.getElementById("navName")) {
    document.getElementById("navName").innerText = name;
}
if (document.getElementById("studentName")) {
    document.getElementById("studentName").innerText = name;
}
if (document.getElementById("studentId")) {
    document.getElementById("studentId").innerText = matrix;
}

/* ===============================
   PROFILE DROPDOWN
================================ */
function toggleProfile(event){
    if(event) event.stopPropagation();
    const dropdown = document.getElementById("profileDropdown");
    dropdown.style.display =
        dropdown.style.display === "block" ? "none" : "block";
}

// Close when click outside
document.addEventListener("click", function(e){
    if(!e.target.closest(".profile-wrapper")){
        const dropdown = document.getElementById("profileDropdown");
        if(dropdown) dropdown.style.display = "none";
    }
});

/* ===============================
   AVATAR COLOR LOGIC (FIXED)
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

function updateAvatar(fullName){
    if(!fullName) return;

    let avatarColor = localStorage.getItem("avatarColor");

    if (!avatarColor) {
        avatarColor = generateAvatarColor(fullName);
        localStorage.setItem("avatarColor", avatarColor);
    }

    const firstLetter = fullName.trim().charAt(0).toUpperCase();

    const navAvatar = document.getElementById("navAvatar");
    const mainAvatar = document.getElementById("mainAvatar");

    if (navAvatar) {
        navAvatar.textContent = firstLetter;
        navAvatar.style.backgroundColor = avatarColor;
    }

    if (mainAvatar) {
        mainAvatar.textContent = firstLetter;
        mainAvatar.style.backgroundColor = avatarColor;
    }
}

/* ===============================
   LOGOUT
================================ */
function logout(){
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}

/* ===============================
   PAGE LOAD INIT
================================ */
window.onload = function() {

    // Redirect kalau belum login
    if (!name || !matrix) {
        window.location.href = "login.html";
        return;
    }

    updateAvatar(name);
    updateHomeNoti(); // 🔥 FIX NOTIFICATION
};

/* ===============================
   PROCEED TO PAYMENT (FIXED)
================================ */
function handleProceed() {

    const courseData = {
        code: document.getElementById("courseCode")?.innerText,
        name: document.getElementById("courseName")?.innerText,
        price: document.getElementById("coursePrice")?.innerText
    };

    let courses = JSON.parse(localStorage.getItem("selectedCourses")) || [];
    courses.push(courseData);

    localStorage.setItem("selectedCourses", JSON.stringify(courses));

    updateHomeNoti();
    window.location.href = "payment.html";
}
