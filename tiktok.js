const { WebcastPushConnection } = require("tiktok-live-connector");
const axios = require("axios");

const tiktokUsername = "howyoufeel34";

async function start() {
    const tiktokLive = new WebcastPushConnection(tiktokUsername);

    try {
        await tiktokLive.connect();
        console.log("✅ Connected to TikTok LIVE:", tiktokUsername);

        // CHAT MESSAGE EVENT (THIS IS THE IMPORTANT FIX)
        tiktokLive.on("chat", async (data) => {
            const user = data.uniqueId;
            const message = data.comment;

            console.log("💬 CHAT:");
            console.log("USER:", user);
            console.log("MESSAGE:", message);

            try {
                await axios.post("http://localhost:3000/event", {
                    user: user,
                    message: message
                });
            } catch (err) {
                console.log("❌ Failed to send to server");
            }
        });

    } catch (err) {
        console.log("⚠️ Not live yet. Retrying...");
        setTimeout(start, 5000);
    }
}

start();