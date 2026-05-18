const { WebcastPushConnection } = require("tiktok-live-connector");

const sessions = {};

async function createSession(username) {
    try {
        console.log("🔵 Connecting TikTok:", username);

        const connection = new WebcastPushConnection(username);

        await connection.connect();

        const sessionId = Math.random().toString(36).slice(2);

        sessions[sessionId] = {
            connection,
            queue: []
        };

        connection.on("chat", (data) => {
            if (!sessions[sessionId]) return;

            sessions[sessionId].queue.push({
                user: data.uniqueId,
                message: data.comment
            });
        });

        console.log("🟢 TikTok CONNECTED");

        return sessionId;

    } catch (err) {
        console.log("🔴 TikTok FAILED:", err.message);

        // IMPORTANT: return null, do not crash system
        return null;
    }
}

function getNextMessage(sessionId) {
    const s = sessions[sessionId];
    if (!s) return null;

    return s.queue.shift() || null;
}

module.exports = { createSession, getNextMessage };
