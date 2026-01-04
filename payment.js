// ================= PAYMENT PAGE =================
document.addEventListener("DOMContentLoaded", function () {

    let courses = JSON.parse(localStorage.getItem("selectedCourses")) || [];

    const summary = document.getElementById("courseSummary");
    const totalPriceEl = document.getElementById("totalPrice");
    const paymentForm = document.getElementById("paymentForm");
    const payNowBtn = document.getElementById("payNow");
    const method = document.getElementById("paymentMethod");
    const card = document.getElementById("cardSection");
    const qr = document.getElementById("qrSection");

    renderSummary();
    updateNoti();

    // ================= RENDER SUMMARY =================
    function renderSummary() {
        summary.innerHTML = "";
        let total = 0;

        if (courses.length === 0) {
            summary.innerHTML = "<p>No course selected.</p>";
            payNowBtn.disabled = true;
            totalPriceEl.innerText = "0";
            return;
        }

        courses.forEach(course => {
            const price = Number(course.price);
            total += price;

            const div = document.createElement("div");
            div.className = "summary-box";
            div.dataset.code = course.code;

            div.innerHTML = `
                <p><strong>${course.name}</strong></p>
                <p>Course Code: ${course.code}</p>
                <p>Section: ${course.section}</p>
                <p>Credit: ${course.credit}</p>
                <p>Instructor: ${course.instructor}</p>
                <p><strong>RM ${price}</strong></p>

                <button class="remove-course">Remove</button>
                <hr>
            `;

            summary.appendChild(div);
        });

        totalPriceEl.innerText = total;
        payNowBtn.disabled = false;
    }

    // ================= PAYMENT METHOD =================
    card.style.display = "none";
    qr.style.display = "none";

    method.onchange = () => {
        card.style.display = method.value === "card" ? "block" : "none";
        qr.style.display = method.value === "qr" ? "block" : "none";
    };

    // ================= FORM SUBMIT =================
    paymentForm.onsubmit = function (e) {
        e.preventDefault();

        const name = document.getElementById("fullName").value.trim();

        if (!name || !method.value) {
            alert("Please complete all fields.");
            return;
        }

        payNowBtn.innerText = "Processing...";
        payNowBtn.disabled = true;

        setTimeout(() => {
            paymentForm.style.display = "none";
            document.getElementById("successBox").style.display = "block";

            renderReceipt(name, courses);

        }, 1500);
    };

    // ================= DONE BUTTON =================
    document.getElementById("doneBtn").onclick = () => {
        localStorage.setItem("enrolledCourses", JSON.stringify(courses));
        localStorage.removeItem("selectedCourses");
        localStorage.removeItem("selectedCourseCount");
        window.location.href = "progress.html";
    };

    // ================= REMOVE COURSE =================
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("remove-course")) {
            const box = e.target.closest(".summary-box");
            const code = box.dataset.code;

            courses = courses.filter(c => c.code !== code);
            localStorage.setItem("selectedCourses", JSON.stringify(courses));

            renderSummary();
            updateNoti();
        }
    });

    // ================= NOTIFICATION =================
    function updateNoti() {
        const count = courses.length;
        const el = document.getElementById("courseCount");
        if (el) el.textContent = count;
    }

    // ================= RENDER RECEIPT =================
    function renderReceipt(name, courses) {
        const receiptBox = document.getElementById("receiptDetails");
        const totalEl = document.getElementById("receiptTotal");
        const receiptIdEl = document.getElementById("receiptId");
        const receiptDateEl = document.getElementById("receiptDate");

        receiptBox.innerHTML = "";
        let total = 0;

        const receiptId = "RCPT-" + Date.now();
        const date = new Date().toLocaleDateString("en-MY", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

        receiptIdEl.textContent = receiptId;
        receiptDateEl.textContent = date;

        courses.forEach(course => {
            total += Number(course.price);

            const div = document.createElement("div");
            div.innerHTML = `
                <p>
                    <strong>${course.name}</strong><br>
                    Code: ${course.code} | Section: ${course.section}<br>
                    Instructor: ${course.instructor}<br>
                    RM ${course.price}
                </p>
                <hr>
            `;
            receiptBox.appendChild(div);
        });

        totalEl.textContent = total;
    }

});
