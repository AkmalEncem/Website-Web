document.addEventListener("DOMContentLoaded", () => {

    const tableBody = document.getElementById("progressTableBody");
    const enrolled = JSON.parse(localStorage.getItem("enrolledCourses")) || [];

    // DETAIL ELEMENT
    const detailBox = document.getElementById("progressDetail");
    const percentEl = document.getElementById("detailPercentage");
    const lessonEl = document.getElementById("detailLessons");
    const quizEl = document.getElementById("detailQuizzes");
    const progressFill = document.getElementById("progressFill");

    // ACHIEVEMENT
    const badgeEl = document.getElementById("detailBadge");
    const certEl = document.getElementById("detailCertificate");

    // DOWNLOAD BUTTON
    const downloadTranscript = document.getElementById("downloadTranscript");
    const downloadReport = document.getElementById("downloadReport");
    const downloadCert = document.getElementById("downloadCertificate");

    tableBody.innerHTML = "";

    if(enrolled.length === 0){
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty">No enrolled course yet</td>
            </tr>
        `;
        return;
    }

    enrolled.forEach((course, index) => {

        const progress = generateProgress(index);
        const isCompleted = progress.percentage === 100;

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${course.code}</td>
            <td>${course.name}</td>
            <td>${course.section}</td>
            <td>${course.credit}</td>
            <td class="progress-text">${progress.percentage}%</td>
            <td class="status ${isCompleted ? "completed" : "in-progress"}">
                ${isCompleted ? "Completed" : "In Progress"}
            </td>
            <td>
                <button class="view-progress">View</button>
            </td>
        `;

        tr.addEventListener("click", () => {
            document
                .querySelectorAll("tbody tr")
                .forEach(row => row.classList.remove("active"));

            tr.classList.add("active");
            showDetail(progress);
        });

        tableBody.appendChild(tr);
    });

    // ================= SHOW DETAIL =================
    function showDetail(progress){
        detailBox.style.display = "block";

        percentEl.textContent = progress.percentage + "%";
        lessonEl.textContent = `${progress.lessonsWatched} / ${progress.totalLessons}`;
        quizEl.textContent = `${progress.quizzesTaken} / ${progress.totalQuizzes}`;

        progressFill.style.width = progress.percentage + "%";

        // BADGE + CERTIFICATE
        if(progress.percentage === 100){
            badgeEl.innerHTML = `<span class="badge completed">🏆 Completed</span>`;
            certEl.textContent = "Available";
            certEl.className = "certificate-available";
            downloadCert.disabled = false;
        }else{
            badgeEl.innerHTML = `<span class="badge in-progress">🎯 In Progress</span>`;
            certEl.textContent = "Not Available";
            certEl.className = "certificate-unavailable";
            downloadCert.disabled = true;
        }
    }

    // ================= DOWNLOAD (DUMMY) =================
    downloadTranscript.addEventListener("click", () => {
        alert("Transcript downloaded (demo)");
    });

    downloadReport.addEventListener("click", () => {
        alert("Progress report downloaded (demo)");
    });

    downloadCert.addEventListener("click", () => {
        alert("Certificate downloaded (demo)");
    });

    // ================= DUMMY PROGRESS =================
    function generateProgress(seed){
        const totalLessons = 10;
        const totalQuizzes = 5;

        const lessonsWatched = Math.min(totalLessons, seed * 2 + 3);
        const quizzesTaken = Math.min(totalQuizzes, seed + 1);

        const percentage = Math.round(
            ((lessonsWatched + quizzesTaken) /
            (totalLessons + totalQuizzes)) * 100
        );

        return {
            percentage,
            lessonsWatched,
            totalLessons,
            quizzesTaken,
            totalQuizzes
        };
    }

});
