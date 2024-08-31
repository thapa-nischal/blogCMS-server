const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const userRoutes = require("./Routes/User");
const blogRoutes = require("./Routes/Blog");
const uploadRoutes = require("./Routes/uploadRoutes");
const connectDB = require("./config/db");

// connect database
connectDB();

function startServer(PORT, maxAttempts = 10) {
    const server = app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });

    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.log(`Port ${PORT} is already in use`);
            if (PORT >= PORT + maxAttempts) {
                console.error(`Failed to find an available port after ${maxAttempts} attempts`);
                process.exit(1); // process exit after max  attempt
            }
            startServer(PORT + 1, maxAttempts); // switch to next port
        } else {
            console.error('Server error:', error);
        }
    });
}

startServer(3000);

app.use(
    cors({
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/", userRoutes);
app.use("/", blogRoutes);
app.use("/", uploadRoutes);