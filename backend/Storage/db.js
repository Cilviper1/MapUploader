// backend/storage/db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "users.db");
const db = new sqlite3.Database(dbPath, err => {
    if (err) {
        console.error("Failed to connect to database:", err);
    } else {
        console.log("Connected to SQLite database.");
    }
});

module.exports = db;
