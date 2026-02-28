require("dotenv").config();
const cors = require("cors");
const express = require("express");

// Boot WebSocket server alongside Express
const { wss } = require("./ws/socket");
const testRoutes = require('./routes/testRoutes');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// routes (uncomment as you build each one)
app.use('/api', testRoutes);
// app.use('/api', resultsRoutes);
// app.use('/api', reportRoutes);

// health check
app.get("/", (req, res) =>
    res.json({
        status: "ok",
        tool: "BeatIT",
        wsPort: process.env.WS_PORT || 8080,
    })
);

app.listen(port, () => {
    console.log(`HTTP server running on port ${port}`);
    console.log(`WebSocket server running on port ${process.env.WS_PORT || 8080}`);
});