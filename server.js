const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Define yt-dlp path explicitly for Render
const ytDlpPath = "/usr/local/bin/yt-dlp";
const downloadsDir = path.join(__dirname, "downloads");

// Ensure downloads directory exists
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir);
}

app.post("/download", (req, res) => {
    const videoUrl = req.body.url;
    if (!videoUrl) {
        return res.status(400).json({ error: "No video URL provided" });
    }

    const outputPath = path.join(downloadsDir, "video.mp4");

    // Execute yt-dlp command
    exec(`${ytDlpPath} -f best -o "${outputPath}" "${videoUrl}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error downloading video: ${error.message}`);
            return res.status(500).json({ error: "Failed to download video" });
        }

        // Send the downloaded file to the client
        res.download(outputPath, "video.mp4", (err) => {
            if (err) {
                console.error(`Error sending file: ${err.message}`);
            }
            // Delete the file after sending to save space
            fs.unlinkSync(outputPath);
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
