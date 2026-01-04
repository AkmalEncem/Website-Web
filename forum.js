/* ===============================
   SESSION & BASIC DATA
================================ */
const name = localStorage.getItem("loggedInUser") || "Guest";
const matrix = localStorage.getItem("lms_matrix") || "CI250026";
const role = localStorage.getItem("lms_role") || "Student";

/* ===============================
   USER INFO DISPLAY
================================ */
function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
}

setText("navName", name);
setText("studentName", name);
setText("studentId", matrix);

/* ===============================
   PROFILE DROPDOWN
================================ */
function toggleProfile(event) {
    if (event) event.stopPropagation();
    const dropdown = document.getElementById("profileDropdown");
    if (dropdown) {
        dropdown.style.display =
            dropdown.style.display === "block" ? "none" : "block";
    }
}

document.addEventListener("click", e => {
    if (!e.target.closest(".profile-wrapper")) {
        const dropdown = document.getElementById("profileDropdown");
        if (dropdown) dropdown.style.display = "none";
    }
});

/* ===============================
   AVATAR COLOR LOGIC
================================ */
function generateAvatarColor(fullName) {
    const colors = [
        "#1abc9c", "#3498db", "#9b59b6",
        "#e67e22", "#e74c3c", "#2ecc71",
        "#f39c12", "#16a085", "#2980b9"
    ];
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
        hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

function updateAvatar(fullName) {
    if (!fullName) return;

    const colorKey = `avatarColor_${fullName}`;
    let avatarColor = localStorage.getItem(colorKey);

    if (!avatarColor) {
        avatarColor = generateAvatarColor(fullName);
        localStorage.setItem(colorKey, avatarColor);
    }

    const letter = fullName.charAt(0).toUpperCase();

    ["navAvatar", "mainAvatar"].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = letter;
            el.style.backgroundColor = avatarColor;
        }
    });
}

/* ===============================
   LOGOUT
================================ */
function logout() {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("lms_role");
    window.location.href = "login.html";
}

/* ===============================
   UTILITIES
================================ */
function escapeHTML(str) {
    return str.replace(/[&<>"']/g, m =>
        ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[m])
    );
}

function randomPastTime(maxDaysAgo = 5, role = "Student") {
    const daysAgo = Math.floor(Math.random() * maxDaysAgo) + 1;
    const date = new Date(Date.now() - daysAgo * 86400000);

    const hours =
        role.toLowerCase() === "lecturer"
            ? 9 + Math.floor(Math.random() * 8)
            : 8 + Math.floor(Math.random() * 14);

    date.setHours(hours, Math.floor(Math.random() * 60), 0, 0);
    return date.toISOString();
}

function formatTime(iso) {
    const date = new Date(iso);
    const diff = Date.now() - date;
    const min = Math.floor(diff / 60000);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);

    if (min < 1) return "Just now";
    if (min < 60) return `${min} minute${min > 1 ? "s" : ""} ago`;
    if (hr < 24) return `${hr} hour${hr > 1 ? "s" : ""} ago`;
    if (day === 1) return "Yesterday";
    if (day <= 5) return `${day} days ago`;

    return date.toLocaleString("en-GB", { hour12: true });
}

/* ===============================
   FORUM DATA
================================ */
const STORAGE_KEY = "forumPosts";
let posts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

if (posts.length === 0) {
    posts = [
        {
            id: 1,
            text: "I'm still confused about basic JavaScript concepts.",
            author: "Ahmad Firdaus",
            role: "Student",
            date: randomPastTime(),
            replies: [
                {
                    author: "Dr. Noraini Hassan",
                    role: "Lecturer",
                    text: "Start with MDN Web Docs and practice regularly.",
                    date: randomPastTime(5, "Lecturer")
                }
            ]
        }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

/* ===============================
   RENDER POSTS
================================ */
function renderPosts(list = posts) {
    const feed = document.getElementById("forumFeed");
    const noResults = document.getElementById("noResults");
    if (!feed) return;

    feed.innerHTML = "";

    if (list.length === 0) {
        if (noResults) noResults.style.display = "block";
        return;
    }
    if (noResults) noResults.style.display = "none";

    list.forEach(post => {
        const div = document.createElement("div");
        div.className = "forum-post";

        div.innerHTML = `
            <div class="post-header">
                <div class="post-avatar">${post.author.charAt(0)}</div>
                <div class="post-info">
                    <h4>${escapeHTML(post.author)}</h4>
                    <p>${formatTime(post.date)}</p>
                </div>
                <span class="post-role ${post.role.toLowerCase()}">${post.role}</span>
            </div>

            <div class="post-content">
                <p>${escapeHTML(post.text)}</p>
            </div>

            <div class="post-actions">
                <span class="action-btn" onclick="toggleReplyBox(${post.id})">Reply</span>
                <span class="reply-count">${post.replies.length} replies</span>
            </div>

            <div class="replies">
                ${post.replies.map(r => `
                    <div class="reply">
                        <div class="reply-avatar">${r.author.charAt(0)}</div>
                        <div class="reply-content">
                            <h5>${escapeHTML(r.author)}</h5>
                            <p>${escapeHTML(r.text)}</p>
                            <small>${formatTime(r.date)}</small>
                        </div>
                    </div>
                `).join("")}
            </div>

            <div class="reply-box" id="reply-box-${post.id}" style="display:none;">
                <input type="text" id="reply-input-${post.id}" placeholder="Write a reply...">
                <button class="reply-btn" onclick="sendReply(${post.id})">Reply</button>
                <button class="cancel-btn" onclick="toggleReplyBox(${post.id})">Cancel</button>
            </div>
        `;

        feed.appendChild(div);
    });
}

/* ===============================
   ADD POST (USES PROFILE NAME)
================================ */
function addPost() {
    const input = document.getElementById("newPost");
    if (!input || !input.value.trim()) return;

    posts.unshift({
        id: Date.now(),
        text: input.value.trim(),
        author: name,     // ✅ SAME AS PROFILE
        role: role,
        date: new Date().toISOString(),
        replies: []
    });

    input.value = "";
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    renderPosts();
}

/* ===============================
   REPLIES (USES PROFILE NAME)
================================ */
function toggleReplyBox(id) {
    const box = document.getElementById(`reply-box-${id}`);
    if (box) {
        box.style.display = box.style.display === "none" ? "flex" : "none";
    }
}

function sendReply(id) {
    const input = document.getElementById(`reply-input-${id}`);
    if (!input || !input.value.trim()) return;

    const post = posts.find(p => p.id === id);
    if (!post) return;

    post.replies.push({
        author: name,     // ✅ SAME AS PROFILE
        role: role,
        text: input.value.trim(),
        date: new Date().toISOString()
    });

    input.value = "";
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    renderPosts();
}

/* ===============================
   SEARCH & FILTER
================================ */
function handleSearchFilter() {
    const term = document.getElementById("search")?.value.toLowerCase() || "";
    const filter = document.getElementById("filter")?.value || "all";

    const filtered = posts.filter(p => {
        const matchText =
            p.text.toLowerCase().includes(term) ||
            p.author.toLowerCase().includes(term);
        const matchRole =
            filter === "all" || p.role.toLowerCase() === filter;
        return matchText && matchRole;
    });

    renderPosts(filtered);
}

document.getElementById("search")?.addEventListener("input", handleSearchFilter);
document.getElementById("filter")?.addEventListener("change", handleSearchFilter);

/* ===============================
   INIT
================================ */
document.addEventListener("DOMContentLoaded", () => {
    updateAvatar(name);
    renderPosts();
});
