const express = require("express");
const { createSession, getNextMessage } = require("./tiktok");

const app = express();
app.use(express.json());

let sessions = {};

app.get("/", (req, res) => {
    res.send("TikTok Bridge Running");
});

app.post("/create-session", async (req, res) => {
    try {
        const username = req.body.username;

        const sessionId = await createSession(username);
        sessions[sessionId] = true;

        res.json({ sessionId });

    } catch (e) {
        console.log("ERROR:", e.message);
        res.status(502).json({ error: e.message });
    }
});

app.get("/next", (req, res) => {
    const sessionId = req.query.session;
    const msg = getNextMessage(sessionId);

    res.json(msg || null);
});

app.listen(process.env.PORT || 8080, () => {
    console.log("Server running");
});
