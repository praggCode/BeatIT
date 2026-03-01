require("dotenv").config();
const cors = require("cors");
const express = require("express");
const http = require("http");
const { initWebSocket } = require("./ws/socket");
const testRoutes = require('./routes/testRoutes');
const resultsRoutes = require('./routes/results');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3001;

// ── CORS ─────────────────────────────────────────────────────────────────────
// Allow requests from the Vercel frontend in production, or any localhost in dev
// const allowedOrigins = process.env.ALLOWED_ORIGINS
//     ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
//     : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors(
//     {
//     origin: (origin, callback) => {
//         // Allow requests with no origin (curl, Render health-checks, etc.)
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.includes(origin)) return callback(null, true);
//         callback(new Error(`CORS blocked: ${origin}`));
//     },
//     credentials: true,
// }
));

app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api', testRoutes);
app.use('/api', resultsRoutes);

// Health check
app.get("/", (_req, res) =>
    res.json({ status: "ok", tool: "BeatIT" })
);

// ── Boot ─────────────────────────────────────────────────────────────────────
// Attach WebSocket to the same HTTP server (single port — required for Render)
initWebSocket(server);

server.listen(port, () => {
    console.log(`HTTP + WebSocket server running on port ${port}`);
});