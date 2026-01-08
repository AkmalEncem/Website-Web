/* ==================================================
   USER PROFILE (INLINE – NO profile.js)
   ================================================== */

/* Avatar color generator */
function generateAvatarColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 55%)`;
}

/* Update avatar */
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

/* Set profile info */
function setUserProfile() {
    const fullName = localStorage.getItem("loggedInUser") || "User";
    const matrix = localStorage.getItem("lms_matrix") || "CI000000";

    const navName = document.getElementById("navName");
    const studentName = document.getElementById("studentName");
    const studentId = document.getElementById("studentId");

    if (navName) navName.textContent = fullName;
    if (studentName) studentName.textContent = fullName;
    if (studentId) studentId.textContent = matrix;

    updateAvatar(fullName);
}

/* Toggle dropdown */
function toggleProfile() {
    const dropdown = document.getElementById("profileDropdown");
    if (!dropdown) return;

    dropdown.style.display =
        dropdown.style.display === "block" ? "none" : "block";
}

/* Close dropdown when click outside */
document.addEventListener("click", (e) => {
    const profile = document.querySelector(".profile-wrapper");
    const dropdown = document.getElementById("profileDropdown");

    if (dropdown && profile && !profile.contains(e.target)) {
        dropdown.style.display = "none";
    }
});

/* ==================================================
   INSTRUCTORS DATA
   ================================================== */

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

/* ==================================================
   INSTRUCTORS FILTER & DISPLAY
   ================================================== */

const instructorList = document.getElementById("instructorList");
const subjectFilter = document.getElementById("subjectFilter");
const facultyFilter = document.getElementById("facultyFilter");

/* Populate subject filter */
const subjectSet = new Set();
instructors.forEach(i => i.subjects.forEach(s => subjectSet.add(s)));

subjectSet.forEach(subject => {
    const option = document.createElement("option");
    option.value = subject;
    option.textContent = subject;
    subjectFilter.appendChild(option);
});

/* Display instructors */
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
            const card = document.createElement("div");
            card.className = "instructor-card";

            card.innerHTML = `
                <img src="${inst.image}" class="instructor-photo">
                <h3>${inst.name}</h3>
                <p><strong>Email:</strong> ${inst.email}</p>
                <p><strong>Faculty:</strong> ${inst.faculty}</p>
                ${inst.subjects.map(s =>
                    `<span class="subject-tag">${s}</span>`
                ).join("")}
            `;

            instructorList.appendChild(card);
        }
    });
}

subjectFilter.addEventListener("change", displayInstructors);
facultyFilter.addEventListener("change", displayInstructors);

/* ==================================================
   INITIAL LOAD
   ================================================== */

document.addEventListener("DOMContentLoaded", () => {
    setUserProfile();
    displayInstructors();
});
