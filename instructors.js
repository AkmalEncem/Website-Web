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

const instructorList = document.getElementById("instructorList");
const subjectFilter = document.getElementById("subjectFilter");
const facultyFilter = document.getElementById("facultyFilter");


// ===== Populate Subject Filter =====
const subjectSet = new Set();

instructors.forEach(inst => {
    inst.subjects.forEach(sub => subjectSet.add(sub));
});

subjectSet.forEach(subject => {
    const option = document.createElement("option");
    option.value = subject;
    option.textContent = subject;
    subjectFilter.appendChild(option);
});

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

// ===== Display Instructors =====
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
                <img src="${inst.image}" alt="${inst.name}" class="instructor-photo">
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

// Initial load
displayInstructors();

