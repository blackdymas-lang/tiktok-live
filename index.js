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

        console.log("🟡 CREATE SESSION:", username);

        const sessionId = await createSession(username);

        if (!sessionId) {
            console.log("🔴 SESSION FAILED (null returned)");
            return res.json({ sessionId: null });
        }

        console.log("🟢 SESSION CREATED:", sessionId);

        return res.json({ sessionId });

    } catch (err) {
        console.log("❌ ERROR:", err.message);
        return res.json({ sessionId: null });
    }
});

app.get("/next", (req, res) => {
    const sessionId = req.query.session;

    if (!sessionId) return res.json(null);

    const msg = getNextMessage(sessionId);

    return res.json(msg || null);
});

app.listen(process.env.PORT || 8080, () => {
    console.log("Server running");
});
