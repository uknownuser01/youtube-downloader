const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Serves frontend files

// Update this path based on where yt-dlp is installed
const ytDlpPath = "C:\\Users\\risha\\AppData\\Roaming\\Python\\Python313\\Scripts\\yt-dlp.exe";

// Check if yt-dlp exists
if (!fs.existsSync(ytDlpPath)) {
    console.error("❌ ERROR: yt-dlp.exe not found! Check the path in server.js.");
    process.exit(1); // Stop the server
}

app.post("/download", (req, res) => {
    const { url } = req.body;
    if (!url) {
        console.error("❌ ERROR: No URL provided");
        return res.status(400).json({ error: "YouTube URL is required" });
    }

    console.log(`✅ Received URL: ${url}`);

    const outputFileName = "video.mp4"; // Name of downloaded file
    const outputPath = path.join(__dirname, "public", outputFileName);

    console.log(`📁 Output path: ${outputPath}`);

    const command = `"${ytDlpPath}" -f best -o "${outputPath}" "${url}"`;

    console.log(`🛠 Running command: ${command}`);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Download failed: ${stderr}`);
            return res.status(500).json({ error: "Failed to download video. Check server logs." });
        }
        console.log(`✅ Download success! File saved to: ${outputPath}`);
        res.json({ downloadLink: `/${outputFileName}` });
    });
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
