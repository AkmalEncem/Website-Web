/* ===============================
   USER PROFILE SETUP
================================ */

function setUserProfile() {
    const name = localStorage.getItem("loggedInUser") || "User";
    const matrix = localStorage.getItem("lms_matrix") || "CI000000";

    const navName = document.getElementById("navName");
    const studentName = document.getElementById("studentName");
    const studentId = document.getElementById("studentId");

    if (navName) navName.innerText = name;
    if (studentName) studentName.innerText = name;
    if (studentId) studentId.innerText = matrix;

    updateAvatar(name);
}

/* ===============================
   PROFILE DROPDOWN
================================ */

function toggleProfile(event) {
    if (event) event.stopPropagation();
    const dropdown = document.getElementById("profileDropdown");
    if (!dropdown) return;

    dropdown.style.display =
        dropdown.style.display === "block" ? "none" : "block";
}

document.addEventListener("click", function (e) {
    if (!e.target.closest(".profile-wrapper")) {
        const dropdown = document.getElementById("profileDropdown");
        if (dropdown) dropdown.style.display = "none";
    }
});

/* ===============================
   AVATAR COLOR LOGIC
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

function updateAvatar(fullName) {
    if (!fullName) return;

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

/* ===============================
   LOGOUT
================================ */

function logout() {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("lms_matrix");
    localStorage.removeItem("avatarColor");
    window.location.href = "login.html";
}

/* ===============================
   INSTRUCTORS DATA
================================ */

const instructors = [
    {
        name: "Dr. Noryusliza Binti Abdullah",
        email: "yusliza@uthm.edu.my",
        faculty: "FSKTM",
        subjects: ["Fundamentals of Web Technology"],
        image: "Dr. Yusliza.jpg"
    },
    {
        name: "Dr. Syazwani Binti Ramli",
        email: "rsyazwani@uthm.edu.my",
        faculty: "FSKTM",
        subjects: ["Human Computer Interaction"],
        image: "Dr. Syazwani.jpg"
    },
    {
        name: "Puan Hanayanti Binti Hafit",
        email: "hana@uthm.edu.my",
        faculty: "FSKTM",
        subjects: ["Human Computer Interaction"],
        image: "Pn. Hanayanti.jpg"
    },
    {
        name: "Dr. Ezak Fadzrin Bin Ahmad Shaubari",
        email: "ezak@uthm.edu.my",
        faculty: "FSKTM",
        subjects: [
            "Creativity and Innovation",
            "Professional Ethics and Occupational"
        ],
        image: "Dr. Ezak.jpg"
    },
    {
        name: "Encik Azizan Bin Ismail",
        email: "azizanis@uthm.edu.my",
        faculty: "FSKTM",
        subjects: ["Creativity and Innovation"],
        image: "En. Azizan.jpg"
    },
    {
        name: "Puan Rozanawati Binti Darman",
        email: "zana@uthm.edu.my",
        faculty: "FSKTM",
        subjects: ["Professional Ethics and Occupational"],
        image: "Pn. Rozanawati.jpg"
    },
    {
        name: "Dr. Nazreena Binti Mohammed Yasin",
        email: "nazreena@uthm.edu.my",
        faculty: "PPUK",
        subjects: ["Integrity and Anti-Corruption"],
        image: "Dr. Nazreena.jpg"
    },
    {
        name: "Encik Ku Hasnan Bin Ku Halim",
        email: "hasnan@uthm.edu.my",
        faculty: "PPUK",
        subjects: ["Integrity and Anti-Corruption"],
        image: "En. Ku Hasnan.jpg"
    },
    {
        name: "Encik Nik Kamal Bin Wan Muhammed",
        email: "kamal@uthm.edu.my",
        faculty: "PPUK",
        subjects: ["Islamic Studies"],
        image: "En. Kamal.jpg"
    },
    {
        name: "Dr. Sharifah Shazwani Binti Syed Mohamed",
        email: "sshazwani@uthm.edu.my",
        faculty: "PPUK",
        subjects: ["Islamic Studies"],
        image: "Dr. Sharifah.jpg"
    }
];

/* ===============================
   FILTER & DISPLAY
================================ */

const instructorList = document.getElementById("instructorList");
const subjectFilter = document.getElementById("subjectFilter");
const facultyFilter = document.getElementById("facultyFilter");

const subjectSet = new Set();
instructors.forEach(i => i.subjects.forEach(s => subjectSet.add(s)));

subjectSet.forEach(subject => {
    const option = document.createElement("option");
    option.value = subject;
    option.textContent = subject;
    subjectFilter.appendChild(option);
});

function displayInstructors() {
    instructorList.innerHTML = "";

    const subjectValue = subjectFilter.value;
    const facultyValue = facultyFilter.value;

    instructors.forEach(inst => {
        const subjectMatch =
            subjectValue === "all" || inst.subjects.includes(subjectValue);
        const facultyMatch =
            facultyValue === "all" || inst.faculty === facultyValue;

        if (subjectMatch && facultyMatch) {
            instructorList.innerHTML += `
                <div class="instructor-card">
                    <img src="${inst.image}" class="instructor-photo">
                    <h3>${inst.name}</h3>
                    <p><strong>Email:</strong> ${inst.email}</p>
                    <p><strong>Faculty:</strong> ${inst.faculty}</p>
                    ${inst.subjects.map(s =>
                        `<span class="subject-tag">${s}</span>`
                    ).join("")}
                </div>
            `;
        }
    });
}

subjectFilter.addEventListener("change", displayInstructors);
facultyFilter.addEventListener("change", displayInstructors);

/* ===============================
   INIT
================================ */

document.addEventListener("DOMContentLoaded", () => {
    setUserProfile();
    displayInstructors();
});
