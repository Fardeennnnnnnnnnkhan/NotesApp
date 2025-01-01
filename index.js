const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

// Load environment variables
require('dotenv').config();

// Set up view engine and middleware
app.set("view engine", 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get('/', function (req, res) {
    fs.readdir(`./files`, function (err, files) {
        res.render("index", { files: files });
    });
});

app.post('/create', function (req, res) {
    fs.writeFile(`./files/${req.body.title.split("").join('')}.txt`, req.body.Details, function (err) {
        res.redirect('/');
    });
});

app.get("/files/:filename", function (req, res) {
    fs.readFile(`./files/${req.params.filename}`, 'utf-8', function (err, filedata) {
        res.render("read", { filename: req.params.filename, filedata: filedata });
    });
});

app.get('/edit/:filename', function (req, res) {
    res.render('edit', { filename: req.params.filename });
});

app.post("/edit", function (req, res) {
    fs.rename(`./files/${req.body.Previous}`, `./files/${req.body.New}`, function (err) {
        res.redirect('/');
    });
});

// Use the PORT from the .env file or default to 3000
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
