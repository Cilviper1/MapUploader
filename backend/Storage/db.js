const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.resolve(__dirname, "../storage/users.db");
const db = new sqlite3.Database(dbPath);

// Create table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    email TEXT,
    nickName TEXT,
    phoneNumber TEXT,
    profilePic TEXT,
    imageUploaded TEXT
  )`);
});

// REGISTER USER
function registerUser(username, password, callback) {
    const sql = `INSERT INTO users (username, password, email, nickName, phoneNumber, profilePic, imageUploaded)
               VALUES (?, ?, '', '', '', NULL, NULL)`;
    db.run(sql, [username, password], function (err) {
        if (err) return callback(err);
        callback(null, { id: this.lastID, username });
    });
}

// LOGIN
function loginUser(username, password, callback) {
    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
    db.get(sql, [username, password], (err, row) => {
        if (err) return callback(err);
        callback(null, row || null);
    });
}

// UPDATE NICKNAME
function updateNickName(userId, newNick, callback) {
    const sql = `UPDATE users SET nickName = ? WHERE id = ?`;
    db.run(sql, [newNick, userId], function (err) {
        if (err) return callback(err);
        callback(null, this.changes > 0);
    });
}

// DELETE NICKNAME
function deleteNickName(userId, callback) {
    const sql = `UPDATE users SET nickName = '' WHERE id = ?`;
    db.run(sql, [userId], function (err) {
        if (err) return callback(err);
        callback(null, this.changes > 0);
    });
}

// LIST USERS
function listAllUsers(callback) {
    const sql = `SELECT * FROM users`;
    db.all(sql, [], (err, rows) => {
        if (err) return callback(err);
        callback(null, rows);
    });
}

module.exports = {
    registerUser,
    loginUser,
    updateNickName,
    deleteNickName,
    listAllUsers,
};
