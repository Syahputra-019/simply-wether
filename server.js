const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

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

// Proses form
app.post("/submit", (req, res) => {
    const { name, email } = req.body;
    res.send(`Data diterima! Nama: ${name}, Email: ${email}`);
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
