const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors"); // Import mongoose directly
const route = require("./router/route");

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS
const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is not set

// Use router
app.use("/api", route);

// Database connection
const username = "admin";
const password = "l-SnE4:=>v2+NMia"; // Original password
const encodedPassword = encodeURIComponent(password); // URL-encoded password
const host = "37.27.207.221";
const port = "27017";
const dbName = "movies"; // Database name
const authSource = "admin"; // Authentication source

// MongoDB connection URI
const uri = `mongodb://${username}:${encodedPassword}@${host}:${port}/${dbName}?authSource=${authSource}`;

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }) // Added options for better compatibility
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start the server
app.listen(PORT, () => {
  console.log("Server is running");
  console.log(`http://localhost:${PORT}`);
});
