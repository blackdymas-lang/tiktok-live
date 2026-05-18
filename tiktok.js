const { WebcastPushConnection } = require("tiktok-live-connector");

const sessions = {};

/**
 * Create TikTok session safely (never crashes server)
 */
async function createSession(username) {
    try {
        if (!username) throw new Error("No username provided");

        console.log("[TikTok] Connecting:", username);

        const connection = new WebcastPushConnection(username);

        // IMPORTANT: connect to TikTok LIVE
        await connection.connect();

        const sessionId =
            Math.random().toString(36).substring(2) +
            Date.now().toString(36);

        sessions[sessionId] = {
            connection,
            queue: []
        };

        // Chat listener
        connection.on("chat", (data) => {
            if (!sessions[sessionId]) return;

            sessions[sessionId].queue.push({
                user: data.uniqueId,
                message: data.comment
            });
        });

        // Optional debug
        connection.on("error", (err) => {
            console.log("[TikTok ERROR]", err);
        });

        console.log("[TikTok] Connected OK:", username);

        return sessionId;

    } catch (err) {
        console.log("[TikTok CONNECT FAILED]", err.message || err);

        // IMPORTANT: DO NOT crash server
        throw new Error("TikTok connection failed: " + (err.message || err));
    }
}

/**
 * Get next message safely
 */
function getNextMessage(sessionId) {
    const session = sessions[sessionId];
    if (!session) return null;

    return session.queue.shift() || null;
}

module.exports = {
    createSession,
    getNextMessage
};
