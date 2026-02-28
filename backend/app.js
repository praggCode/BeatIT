require("dotenv").config();
const cors = require("cors");

const express = require("express");
const app = express();
const port = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());

// routes
// app.use('/api', testRoutes);
// app.use('/api', resultsRoutes);
// app.use('/api', reportRoutes);

// health check
app.get('/', (req, res) => res.json({ status: 'ok', tool: 'BeatIT' }));


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

