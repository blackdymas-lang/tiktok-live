const express = require("express");
const { createSession, getNextMessage } = require("./tiktok");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

// Health check
app.get("/", (req, res) => {
    res.send("TikTok Bridge Running");
});

// Create session (SAFE)
app.post("/create-session", async (req, res) => {
    try {
        const username = req.body.username;

        console.log("[API] create-session:", username);

        const sessionId = await createSession(username);

        return res.json({
            sessionId
        });

    } catch (err) {
        console.log("[API ERROR]", err.message);

        return res.status(502).json({
            error: err.message,
            success: false
        });
    }
});

// Get next message
app.get("/next", (req, res) => {
    const sessionId = req.query.session;

    if (!sessionId) {
        return res.json(null);
    }

    const message = getNextMessage(sessionId);

    if (!message) {
        return res.json(null);
    }

    res.json(message);
});

// Start server
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
