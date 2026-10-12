// ============================================
// server.js — MySQL backend for SQL_shortened.js
// Run:  node server.js
// Needs:  npm install express mysql2 cors
// ============================================

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "myapp",
  waitForConnections: true,
  connectionLimit: 10
});

// Only allow these statement types.
// Blocks DROP, TRUNCATE, ALTER, GRANT, etc.
const ALLOWED = ["SELECT", "INSERT", "UPDATE", "DELETE"];

app.post("/sql", (req, res) => {
  const { query, params } = req.body;

  if (typeof query !== "string") {
    return res.json({ error: "Missing query" });
  }

  const firstWord = query.trim().split(/\s+/)[0].toUpperCase();
  if (!ALLOWED.includes(firstWord)) {
    return res.json({ error: "Statement not allowed: " + firstWord });
  }

  db.query(query, params || [], (err, result) => {
    if (err) return res.json({ error: err.message });
    res.json(result);
  });
});

app.listen(3000, () => {
  console.log("SQL server running on http://localhost:3000");
});