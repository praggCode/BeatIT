const { WebSocketServer } = require("ws");

const wss = new WebSocketServer({ port: process.env.WS_PORT || 8080 });

// ── Connection handling ───────────────────────────────────────────────────────
wss.on("connection", (ws) => {
  console.log("Client connected | Total clients:", wss.clients.size);

  // Send a welcome/ready signal to the connected client
  ws.send(JSON.stringify({ type: "connected", message: "BeatIT WebSocket ready" }));

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      console.log("Received from client:", data);
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

// ── Broadcast to ALL connected clients ───────────────────────────────────────
// This is what the test runner will call every 500ms to push live metrics
const broadcast = (payload) => {
  const data = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(data);
    }
  });
};

// ── Emit types you'll use throughout BeatIT ──────────────────────────────────
//
// broadcast({ type: "metrics", data: { p50, p95, p99, throughput, errorRate, activeUsers } })
// broadcast({ type: "alert",   data: { metric, value, threshold, severity } })
// broadcast({ type: "status",  data: { state: "running" | "completed" | "error" } })
// broadcast({ type: "result",  data: { ...finalSummary } })

module.exports = { wss, broadcast };