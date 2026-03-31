const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

const app = express();

/* ✅ DB CONNECTION (LOCAL + RENDER SUPPORT) */
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        user: "postgres",
        host: "localhost",
        database: "librarydb",
        password: "ashmi",
        port: 5432,
      }
);

app.use(cors());
app.use(express.json());

/* ✅ Serve frontend */
app.use(express.static(path.join(__dirname, "frontend")));

/* ✅ Default route */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "login.html"));
});

/* ================= LOGIN ================= */
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND password=$2",
      [email, password]
    );

    res.json({ success: result.rows.length > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* ================= ADD BOOK ================= */
app.post("/api/addbook", async (req, res) => {
  try {
    const { name, author } = req.body;

    await pool.query(
      "INSERT INTO books (name, author) VALUES ($1,$2)",
      [name, author]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* ================= SEARCH BOOK ================= */
app.get("/api/search", async (req, res) => {
  try {
    const { name } = req.query;

    const result = await pool.query(
      "SELECT * FROM books WHERE name ILIKE $1",
      [`%${name}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.json([]);
  }
});

/* ================= ISSUE BOOK ================= */
app.post("/api/issue", async (req, res) => {
  try {
    const { student, book } = req.body;

    await pool.query(
      "INSERT INTO issued (student, book) VALUES ($1,$2)",
      [student, book]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* ✅ PORT FIX (IMPORTANT FOR RENDER) */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});