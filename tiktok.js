const { WebcastPushConnection } = require("tiktok-live-connector");
const crypto = require("crypto");

// sessionId -> { connection, queue }
const sessions = new Map();

async function createSession(username) {
    // Clean username
    username = username.replace("@", "").trim();

    // Unique session ID
    const sessionId = crypto.randomBytes(16).toString("hex");

    // Create TikTok connection
    const connection = new WebcastPushConnection(username);

    // Queue for incoming chat messages
    const queue = [];

    // Connect to TikTok LIVE
    await connection.connect();

    console.log(`Connected to TikTok LIVE: ${username}`);
    console.log(`Session created: ${sessionId}`);

    // Listen for chat messages
    connection.on("chat", (data) => {
        const payload = {
            user: data.uniqueId,
            message: data.comment
        };

        queue.push(payload);

        // Keep queue from growing forever
        if (queue.length > 500) {
            queue.shift();
        }

        console.log(`[${username}] ${payload.user}: ${payload.message}`);
    });

    // Optional logging
    connection.on("disconnected", () => {
        console.log(`Disconnected from ${username}`);
    });

    connection.on("error", (err) => {
        console.error(`TikTok error (${username}):`, err);
    });

    // Save session
    sessions.set(sessionId, {
        connection,
        queue,
        username,
        createdAt: Date.now()
    });

    return sessionId;
}

function getNextMessage(sessionId) {
    const session = sessions.get(sessionId);

    if (!session) {
        return null;
    }

    if (session.queue.length === 0) {
        return null;
    }

    return session.queue.shift();
}

module.exports = {
    createSession,
    getNextMessage
};
