document.addEventListener("DOMContentLoaded", () => {
    /* ================= SESSION DATA (KEKALKAN SEPERTI INDEX) ================= */
    const name = localStorage.getItem("loggedInUser") || "User";
    const matrix = localStorage.getItem("lms_matrix") || "CI250026";

    // Papar info user kat Header & Dropdown
    if (document.getElementById("navName")) document.getElementById("navName").innerText = name;
    if (document.getElementById("studentName")) document.getElementById("studentName").innerText = name;
    if (document.getElementById("studentId")) document.getElementById("studentId").innerText = matrix;
    
    updateAvatar(name);
    updateHomeNoti();

    /* ================= LOGIK TESTIMONIAL ================= */
    
    // 1. POST ASAL (Sentiasa ada)
    const defaultReviews = [
        { 
            name: "Aisyah", matrix: "CI240112", course: "English Communication", rating: 5, 
            text: "Excellent platform! The navigation is very smooth and it's so easy to access all my learning materials in one place.", 
            date: "12 Dec 2025" 
        },
        { 
            name: "Zulhelmi", matrix: "CI240155", course: "Integrity and Anti-Corruption", rating: 3, 
            text: "The website looks good, but I find the profile dropdown a bit laggy sometimes. Hope you guys can optimize the performance.", 
            date: "28 Dec 2025" 
        },
        { 
            name: "Daniel", matrix: "CI240099", course: "Web Technology", rating: 5, 
            text: "I really love the dark mode design! It makes studying at night much more comfortable for my eyes.", 
            date: "02 Jan 2026" 
        },
        { 
            name: "Sarah Tan", matrix: "CI230041", course: "Creativity and Innovation", rating: 2, 
            text: "I'm having trouble with the course badge notification. It doesn't update immediately after I make a payment. Needs improvement.", 
            date: "03 Jan 2026" 
        },
        { 
            name: "Ryan Khoo", matrix: "CI250102", course: "Human Computer Interaction", rating: 4, 
            text: "Very helpful for tracking my progress. It would be perfect if we could upload profile pictures directly.", 
            date: "04 Jan 2026" 
        }
    ];

    // 2. FUNGSI UNTUK PAPAR SEMUA POST
    function renderReviews() {
        // Ambil post yang user tambah sendiri dari storage
        const userReviews = JSON.parse(localStorage.getItem("user_added_reviews")) || [];
        
        // GABUNGKAN: Post baru user kat atas, post asal kat bawah
        const allReviews = [...userReviews, ...defaultReviews];

        const list = document.getElementById("testimonialList");
        list.innerHTML = "";

        allReviews.forEach(r => {
            let starsHtml = "";
            for(let i=1; i<=5; i++) {
                starsHtml += `<span class="star ${i <= r.rating ? 'filled' : ''}">★</span>`;
            }

            list.innerHTML += `
                <div class="rating-card">
                    <h4>${r.course}</h4>
                    <p class="review-user">${r.name} (${r.matrix})</p>
                    <div class="star-display" style="color:#fbbf24; margin-bottom:10px;">${starsHtml}</div>
                    <p class="review-text">"${r.text}"</p>
                    <small style="color:#666; font-size:11px;">${r.date || ''}</small>
                </div>
            `;
        });

        // Kira purata rating
        const avg = allReviews.reduce((a, b) => a + b.rating, 0) / allReviews.length;
        document.getElementById("averageRating").innerText = avg.toFixed(1) + " ★";
    }

    /* ================= INPUT BINTANG ================= */
    /* ================= INPUT BINTANG (WITH HOVER EFFECT) ================= */
let userRating = 0;
const starInput = document.querySelectorAll("#starInput .star");

starInput.forEach(star => {
    // Apabila mouse lalu (hover)
    star.onmouseenter = () => {
        const hoverValue = parseInt(star.dataset.value);
        starInput.forEach(s => {
            s.classList.toggle("active", s.dataset.value <= hoverValue);
        });
    };

    // Apabila mouse keluar (leave) tanpa klik
    star.onmouseleave = () => {
        starInput.forEach(s => {
            s.classList.toggle("active", s.dataset.value <= userRating);
        });
    };

    // Apabila bintang diklik (lock rating)
    star.onclick = () => {
        userRating = parseInt(star.dataset.value);
        // Pastikan visual bintang kekal pada rating yang dipilih
        starInput.forEach(s => {
            s.classList.toggle("active", s.dataset.value <= userRating);
        });
    };
});

    /* ================= HANTAR POST BARU ================= */
    document.getElementById("submitReviewBtn").onclick = () => {
        const course = document.getElementById("courseSelect").value;
        const text = document.getElementById("reviewText").value;

        if(!course || !text || userRating === 0) {
            alert("Please complete the form and select a star rating!");
            return;
        }

        const newEntry = {
            name: name,
            matrix: matrix,
            course: course,
            rating: userRating,
            text: text,
            date: new Date().toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })
        };

        // Simpan ke storage khas untuk "user_added_reviews" sahaja
        let userReviews = JSON.parse(localStorage.getItem("user_added_reviews")) || [];
        userReviews.unshift(newEntry);
        localStorage.setItem("user_added_reviews", JSON.stringify(userReviews));
        
        // Reset form
        document.getElementById("reviewText").value = "";
        userRating = 0;
        starInput.forEach(s => s.classList.remove("active"));
        
        renderReviews();
    };

    renderReviews();
});

/* ================= GLOBAL FUNCTIONS (NAVBAR) ================= */
function toggleProfile() {
    const dropdown = document.getElementById("profileDropdown");
    dropdown.style.display = (dropdown.style.display === "block") ? "none" : "block";
}

document.addEventListener("click", (e) => {
    if (!e.target.closest(".profile-wrapper")) {
        document.getElementById("profileDropdown").style.display = "none";
    }
});

function updateAvatar(name) {
    if(!name) return;
    const letter = name.charAt(0).toUpperCase();
    const color = localStorage.getItem("avatarColor") || "#6c63ff";
    if(document.getElementById("navAvatar")) {
        document.getElementById("navAvatar").innerText = letter;
        document.getElementById("navAvatar").style.backgroundColor = color;
    }
    if(document.getElementById("mainAvatar")) {
        document.getElementById("mainAvatar").innerText = letter;
        document.getElementById("mainAvatar").style.backgroundColor = color;
    }
}

function updateHomeNoti() {
    const courses = JSON.parse(localStorage.getItem("selectedCourses")) || [];
    const badge = document.getElementById("courseBadge");
    const paymentMenu = document.getElementById("paymentMenu");
    if(badge && courses.length > 0) {
        badge.style.display = "inline-block";
        badge.innerText = `+${courses.length}`;
        paymentMenu.innerHTML = `Payment <span style="color:red;">(${courses.length})</span>`;
    }
}

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}