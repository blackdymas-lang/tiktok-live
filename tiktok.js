const { WebcastPushConnection } = require("tiktok-live-connector");

const sessions = {};

async function createSession(username) {
    const connection = new WebcastPushConnection(username);

    await connection.connect();

    const sessionId = Math.random().toString(36).substring(2);

    sessions[sessionId] = {
        queue: [],
        connection
    };

    connection.on("chat", (data) => {
        sessions[sessionId].queue.push({
            user: data.uniqueId,
            message: data.comment
        });
    });

    return sessionId;
}

function getNextMessage(sessionId) {
    if (!sessions[sessionId]) return null;
    return sessions[sessionId].queue.shift() || null;
}

module.exports = { createSession, getNextMessage };
