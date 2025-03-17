const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// Koneksi ke PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, 
    ssl: { rejectUnauthorized: false } 
});

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

// Proses form (simpan ke database)
app.post("/submit", async (req, res) => {
    const { name, email } = req.body;
    try {
        const result = await pool.query("INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *", [name, email]);
        res.send(`Data berhasil disimpan! Nama: ${result.rows[0].name}, Email: ${result.rows[0].email}`);
    } catch (err) {
        console.error(err);
        res.send("Gagal menyimpan data.");
    }
});

// Menampilkan semua data
app.get("/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.send("Gagal mengambil data.");
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
