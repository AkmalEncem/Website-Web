document.addEventListener("DOMContentLoaded", function () {

/* ================= BASIC SELECTORS ================= */
const filter = document.getElementById("courseFilter");
const searchInput = document.getElementById("searchInput");
const courses = document.querySelectorAll(".course-card");
const noResults = document.getElementById("noResults");
const popup = document.getElementById("coursePopup");
const instructorFilter = document.getElementById("instructorFilter");
const proceedBtn = document.querySelector(".enroll-btn");

const badge = document.getElementById("courseBadge");
const paymentMenu = document.getElementById("paymentMenu");

if (courses.length === 0) {
        noResults.style.display = "block";
    } else {
        noResults.style.display = "none";
    }

/* ================= SESSION DATA (STANDARD) ================= */
const name = localStorage.getItem("loggedInUser");
const matrix = localStorage.getItem("lms_matrix");

/* ================= AUTH CHECK ================= */
if (!name || !matrix) {
    window.location.href = "login.html";
    return;
}

/* ================= USER INFO ================= */
if (document.getElementById("navName")) document.getElementById("navName").innerText = name;
if (document.getElementById("studentName")) document.getElementById("studentName").innerText = name;
if (document.getElementById("studentId")) document.getElementById("studentId").innerText = matrix;

/* ================= SELECTED COURSE BADGE ================= */
let selectedCourses = JSON.parse(localStorage.getItem("selectedCourses")) || [];
let count = selectedCourses.length;

if (count > 0) {
    badge.style.display = "inline-block";
    badge.textContent = `+${count}`;
    paymentMenu.innerHTML = `Payment <span style="color:red;">(${count})</span>`;
} else {
    badge.style.display = "none";
    paymentMenu.innerText = "Payment";
}

/* ================= PROFILE ================= */
window.toggleProfile = function(event){
    if(event) event.stopPropagation();
    const dropdown = document.getElementById("profileDropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
};

window.logout = function(){
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
};

document.addEventListener("click", function(e){
    if(!e.target.closest(".profile-wrapper")){
        document.getElementById("profileDropdown").style.display = "none";
    }
});

/* ================= AVATAR (FIXED & CONSISTENT) ================= */
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

function updateAvatar(fullName) {
    let avatarColor = localStorage.getItem("avatarColor");

    if (!avatarColor) {
        avatarColor = generateAvatarColor(fullName);
        localStorage.setItem("avatarColor", avatarColor);
    }

    const letter = fullName.trim().charAt(0).toUpperCase();
    const navAvatar = document.getElementById("navAvatar");
    const mainAvatar = document.getElementById("mainAvatar");

    if (navAvatar) {
        navAvatar.textContent = letter;
        navAvatar.style.backgroundColor = avatarColor;
    }
    if (mainAvatar) {
        mainAvatar.textContent = letter;
        mainAvatar.style.backgroundColor = avatarColor;
    }
}

// 🔒 SET AVATAR SEKALI SAHAJA
updateAvatar(name);

/* ================= INSTRUCTOR DATA ================= */
const instructorData = {
    "Fundamentals of Web Technology": ["Dr. Yusliza"],
    "Human Computer Interaction": ["Puan Hanayanti", "Dr. Syazwani"],
    "Creativity and Innovation": ["Dr. Ezak", "Encik Azizan"],
    "Professional Ethics and Occupational": ["Puan Rozanawati", "Dr. Ezak"],
    "Integrity and Anti-Corruption": ["Dr. Nazreena", "Encik Ku Hasnan"],
    "English for General Communication": ["Puan Suzilla", "Puan Wardah"],
    "Islamic Studies": ["Encik Kamal", "Ustazah Sharifah"]
};

/* ================= POPULATE INSTRUCTOR FILTER ================= */
const instructorSet = new Set();
Object.values(instructorData).forEach(list => list.forEach(n => instructorSet.add(n)));

instructorSet.forEach(n => {
    const opt = document.createElement("option");
    opt.value = n;
    opt.textContent = n;
    instructorFilter.appendChild(opt);
});

/* ================= FILTER FUNCTION ================= */
function applyFilters() {
    let visible = 0;
    const courseValue = filter.value;
    const searchValue = searchInput.value.toLowerCase();
    const instructorValue = instructorFilter.value;

    // Loop setiap course untuk decide nak show atau tak
    courses.forEach(card => {
        const title = card.querySelector("h3").innerText;
        const text = card.innerText.toLowerCase();
        const code = card.dataset.code;
        const instructors = instructorData[title] || [];

        const show =
            (courseValue === "all" || courseValue === code) &&
            text.includes(searchValue) &&
            (instructorValue === "all" || instructors.includes(instructorValue));

        card.style.display = show ? "block" : "none";
        if (show) visible++;
    });

    // 🚨 Tunjuk "Sorry no results" bila:
    // - Tiada course langsung
    // - Atau tiada match filter
    noResults.style.display = (courses.length === 0 || visible === 0) ? "block" : "none";
}

// Jalankan sekali bila page load untuk initial check
applyFilters();

filter.addEventListener("change", applyFilters);
searchInput.addEventListener("keyup", applyFilters);
instructorFilter.addEventListener("change", applyFilters);

/* ================= COURSE POPUP ================= */
courses.forEach(card => {
    const btn = card.querySelector(".details-btn");
    if (!btn) return;

    btn.addEventListener("click", function(e){
        e.preventDefault();

        const title = card.querySelector("h3").innerText;
        const creditText = card.querySelectorAll("p")[2].innerText;
        const credit = parseInt(creditText.match(/\d+/)[0]);

        popup.querySelector("h2").innerText = title;
        popup.querySelector(".popup-desc").innerText = card.querySelector("p").innerText;
        popup.querySelector(".popup-code").innerText = card.querySelectorAll("p")[1].innerText;
        popup.querySelector(".popup-credit").innerText = creditText;

        document.getElementById("priceValue").innerText =
            credit === 3 ? "RM600" : "RM400";

        const select = document.getElementById("instructorSelect");
        select.innerHTML = '<option value="">Choose Instructor</option>';

        (instructorData[title] || []).forEach(n => {
            const opt = document.createElement("option");
            opt.value = n;
            opt.textContent = n;
            select.appendChild(opt);
        });

        document.getElementById("sectionInput").value = "";
        select.value = "";

        document.getElementById("viewTimetableBtn").onclick = () => {
            window.open(
                "https://timetable.uthm.edu.my/index.php/site/course?view=schedule",
                "_blank"
            );
        };

        popup.style.display = "flex";
        popup.querySelector(".popup-box").classList.add("show");
    });
});

/* ================= CLOSE POPUP ================= */
function closePopup(){
    popup.querySelector(".popup-box").classList.remove("show");
    setTimeout(() => popup.style.display = "none", 300);
}

popup.querySelector(".close-btn").onclick = closePopup;
popup.onclick = e => { if(e.target === popup) closePopup(); };

/* ================= PROCEED ================= */
proceedBtn.onclick = function(){

    const section = document.getElementById("sectionInput").value.trim();
    const instructor = document.getElementById("instructorSelect").value;

    if(!section || !instructor){
        alert("Please complete all fields.");
        return;
    }

    const course = {
        name: popup.querySelector("h2").innerText.trim(),
        code: popup.querySelector(".popup-code").innerText.split(":")[1].trim(),
        credit: popup.querySelector(".popup-credit").innerText.split(":")[1].trim(),
        instructor,
        section: section.toUpperCase(),
        price: document.getElementById("priceValue").innerText.replace("RM","")
    };

    let selectedCourses = JSON.parse(localStorage.getItem("selectedCourses")) || [];

    if(selectedCourses.some(c => c.code === course.code)){
        alert("Course already added.");
        return;
    }

    selectedCourses.push(course);
    localStorage.setItem("selectedCourses", JSON.stringify(selectedCourses));
    localStorage.setItem("selectedCourseCount", selectedCourses.length);

    closePopup();
    alert("Course added!");
};
});

