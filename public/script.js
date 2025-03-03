document.getElementById("downloadBtn").addEventListener("click", async () => {
    const url = document.getElementById("url").value;
    const quality = document.getElementById("quality").value;
    const status = document.getElementById("status");
    const progressBar = document.getElementById("progressBarContainer");

    if (!url) {
        status.textContent = "⚠️ Please enter a YouTube URL!";
        return;
    }

    status.textContent = "⏳ Downloading... Please wait.";
    progressBar.style.display = "block"; // Show progress bar

    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        document.getElementById("progressBar").style.width = `${progress}%`;
        if (progress >= 100) clearInterval(interval);
    }, 500);

    try {
        const response = await fetch("http://localhost:3000/download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, quality }),
        });

        clearInterval(interval);
        document.getElementById("progressBar").style.width = "100%";

        const data = await response.json();
        if (data.downloadLink) {
            status.innerHTML = `✅ Download Ready! <a href="${data.downloadLink}" download>Click here</a>`;
        } else {
            status.textContent = "❌ Download failed. Try again.";
        }
    } catch (error) {
        status.textContent = "❌ Error connecting to the server.";
    }
});

