const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve uploaded files securely
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

require("dotenv").config();

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "workflow_db"
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL (Raw) Connected...");
});

global.db = db; // make db accessible in routes

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/documents", require("./routes/documentRoutes"));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));