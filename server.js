import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import logger from "./middleware/logger.js";
import dotenv from "dotenv";
import apiRouter from "./routes/index.js";

dotenv.config(); // Load environment variables

// Initialize app
const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Middleware
app.use(express.json()); // Parse JSON request body
app.use(logger); // Log requests

// Database connection and server start
const startServer = async () => {
  try {
    // Attempt to connect to the database
    await connectDB();

    // Start the server if DB connection is successful
    app.use("/api/v1", apiRouter);

    // Basic route
    app.get("/", (req, res) => {
      res.send("Welcome to the Node.js and Mongoose API");
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send({ message: "Something went wrong!" });
    });

    // Start the server
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error.message);
    process.exit(1); // Exit the process if the connection fails
  }
};

// Call startServer to initialize everything
startServer();
