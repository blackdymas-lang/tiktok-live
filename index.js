const express = require("express");
const { createSession, getNextMessage } = require("./tiktok");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get("/", (req, res) => {
    res.send("TikTok Bridge Running");
});

// Create a session for a TikTok username
app.post("/create-session", async (req, res) => {
    const username = (req.body.username || "").replace("@", "").trim();

    if (!username) {
        return res.status(400).json({
            error: "Missing username"
        });
    }

    try {
        const sessionId = await createSession(username);
        res.json({
            sessionId
        });
    } catch (err) {
        console.error("Create session failed:", err);
        res.status(500).json({
            error: "Failed to create session"
        });
    }
});

// Return the next queued message for a session
app.get("/next", (req, res) => {
    const sessionId = req.query.session;

    if (!sessionId) {
        return res.json(null);
    }

    const message = getNextMessage(sessionId);

    if (message) {
        res.json(message);
    } else {
        res.json(null);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
