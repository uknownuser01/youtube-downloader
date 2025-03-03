document.getElementById("downloadBtn").addEventListener("click", async () => {
    const videoUrl = document.getElementById("videoUrl").value;
    if (!videoUrl) {
        alert("Please enter a YouTube URL");
        return;
    }

    const backendUrl = "https://youtube-downloader-api-amca.onrender.com"; // Replace with your Render backend URL

    try {
        const response = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: videoUrl }),
        });

        if (!response.ok) {
            throw new Error("Failed to download video");
        }

        // Convert response to blob for downloading
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = "video.mp4";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (error) {
        console.error("Error:", error);
        alert("Error downloading video. Please try again.");
    }
});
