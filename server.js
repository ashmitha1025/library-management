const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

const app = express();

// DB connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "librarydb",
  password: "ashmi", // CHANGE THIS
  port: 5432,
});

app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "frontend")));

// Default page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "login.html"));
});

/* LOGIN */
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1 AND password=$2",
    [email, password]
  );

  res.json({ success: result.rows.length > 0 });
});

/* ADD BOOK */
app.post("/api/addbook", async (req, res) => {
  const { name, author } = req.body;

  await pool.query(
    "INSERT INTO books (name, author) VALUES ($1,$2)",
    [name, author]
  );

  res.json({ success: true });
});

/* SEARCH BOOK */
app.get("/api/search", async (req, res) => {
  const { name } = req.query;

  const result = await pool.query(
    "SELECT * FROM books WHERE name ILIKE $1",
    [`%${name}%`]
  );

  res.json(result.rows);
});

/* ISSUE BOOK */
app.post("/api/issue", async (req, res) => {
  const { student, book } = req.body;

  await pool.query(
    "INSERT INTO issued (student, book) VALUES ($1,$2)",
    [student, book]
  );

  res.json({ success: true });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});