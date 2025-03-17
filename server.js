require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// Koneksi ke PostgreSQL Heroku
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Diperlukan untuk koneksi ke Heroku
  },
});

// Konfigurasi EJS
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// Halaman utama
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Halaman form
app.get("/form", (req, res) => {
  res.render("form");
});

// Proses form - Simpan data ke PostgreSQL
app.post("/submit", async (req, res) => {
  const { name, email } = req.body;

  try {
    await pool.query("INSERT INTO users (name, email) VALUES ($1, $2)", [
      name,
      email,
    ]);
    res.send(`Data berhasil disimpan! <a href="/data">Lihat Data</a>`);
  } catch (err) {
    console.error(err);
    res.send("Terjadi kesalahan saat menyimpan data.");
  }
});

// Halaman data - Menampilkan semua pengguna
app.get("/data", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.render("data", { users: result.rows });
  } catch (err) {
    console.error(err);
    res.send("Gagal mengambil data.");
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
