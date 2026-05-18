const express = require("express");
const app = express();

app.use(express.json());

let latestEvent = null;

// Receive from TikTok
app.post("/event", (req, res) => {
    latestEvent = req.body;

    console.log("📩 EVENT RECEIVED:", latestEvent);

    res.sendStatus(200);
});

// Roblox polls this
app.get("/next", (req, res) => {
    res.json(latestEvent);
    latestEvent = null;
});

app.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
});