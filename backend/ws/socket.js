const { WebSocketServer } = require("ws");

let wss;

/**
 * Initialise the WebSocket server.
 * In production (Render) we attach to the shared HTTP server so only one
 * port is needed.  In development we can still fall back to a dedicated port.
 *
 * @param {import('http').Server} httpServer
 */
function initWebSocket(httpServer) {
  if (httpServer) {
    // Production / single-port mode: piggyback on the Express HTTP server
    wss = new WebSocketServer({ server: httpServer });
    console.log("WebSocket server attached to HTTP server");
  } else {
    // Legacy / local dev: separate port
    const port = process.env.WS_PORT || 8080;
    wss = new WebSocketServer({ port });
    console.log(`WebSocket server running on port ${port}`);
  }

  wss.on("connection", (ws) => {
    console.log("Client connected | Total clients:", wss.clients.size);
    ws.send(JSON.stringify({ type: "connected", message: "BeatIT WebSocket ready" }));

    ws.on("message", (message) => {
      try {
        JSON.parse(message);
      } catch (err) {
        console.error("Invalid message format:", err.message);
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected | Total clients:", wss.clients.size);
    });

    ws.on("error", (err) => {
      console.error("WebSocket error:", err.message);
    });
  });
}

const broadcast = (payload) => {
  if (!wss) return;
  const data = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(data);
    }
  });
};

module.exports = { initWebSocket, broadcast };