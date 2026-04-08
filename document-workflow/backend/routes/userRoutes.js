const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";

  db.query(sql, [username, email, hashedPassword, role], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send("User registered");
  });
});

module.exports = router;