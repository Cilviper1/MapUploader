// backend/index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const register = require("./API/register");
const login = require("./API/login");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/register", (req, res) => {
    const { username, password } = req.body;
    register(username, password, (err, result) => {
        if (err) return res.status(400).json({ error: err });
        res.json(result);
    });
});

app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    login(username, password, (err, user) => {
        if (err) return res.status(401).json({ error: err });
        res.json(user);
    });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
