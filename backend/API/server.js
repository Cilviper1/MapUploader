import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
// import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.static(join(__dirname, '../../frontend/public')));

// In-memory user storage (replace with database later)
let users = [];
let nextUserId = 1;



// Initialize users on startup
initializeMockUsers();
// Initialize with mock data
function initializeMockUsers() {
    const firstNames = ["Alex", "Taylor", "Jordan", "Morgan", "Casey", "Jamie", "Riley", "Avery", "Charlie", "Skyler"];
    const lastNames = ["Smith", "Lee", "Davis", "Kim", "Brown", "Lopez", "Clark", "Patel", "Nguyen", "Harris"];
    const domains = ["example.com", "mail.com", "test.org", "mydomain.net"];

    // Add test user
    users.push({
        id: 1,
        username: "1",
        password: "1",
        email: "1@test.test",
        nickName: "Test User",
        phoneNumber: null,
        profilePic: null,
        imageUploaded: null
    });


    // Add random users
    for (let i = 2; i <= 20; i++) {
        const first = firstNames[Math.floor(Math.random() * firstNames.length)];
        const last = lastNames[Math.floor(Math.random() * lastNames.length)];
        const username = `${first.toLowerCase()}${last.toLowerCase()}${Math.floor(Math.random() * 1000)}`;
        const email = `${username}@${domains[Math.floor(Math.random() * domains.length)]}`;

        users.push({
            id: i,
            username,
            password: "1",
            email,
            nickName: "",
            phoneNumber: null,
            profilePic: null,
            imageUploaded: null
        });
    }
    nextUserId = 21;
    console.log("Mock users initialized");
}



// AUTH ROUTES


// Register endpoint
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
    }

    // Create new user
    const newUser = {
        id: nextUserId++,
        username,
        password,
        email: "",
        nickName: "",
        phoneNumber: null,
        profilePic: null,
        imageUploaded: null
    };

    users.push(newUser);

    res.status(201).json({
        message: "Registration successful",
        user: { id: newUser.id, username: newUser.username }
    });
});



// Login endpoint
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required." });
    }

    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    db.get(query, [username, password], (err, user) => {
        if (err) {
            console.error("Login error:", err.message);
            return res.status(500).json({ message: "Internal server error." });
        }

        if (!user) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        // Optionally remove sensitive data before sending back
        delete user.password;
        res.json({ user });
    });
});



// Get current user profile
const userId = parseInt(req.params.id);
const user = users.find(u => u.id === userId);

if (user) {
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
} else {
    res.status(404).json({ error: "User not found" });
}



// Get user profile by ID
app.get('/api/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (user) {
        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } else {
        res.status(404).json({ error: "User not found" });
    }
});



// Update nickname
app.put('/api/user/:id/nickname', (req, res) => {
    const userId = parseInt(req.params.id);
    const { nickName } = req.body;

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({ error: "User not found" });
    }

    users[userIndex].nickName = nickName || "";
    const { password: _, ...userWithoutPassword } = users[userIndex];

    res.json({
        message: "Nickname updated",
        user: userWithoutPassword
    });
});



// List all users (for debugging)
app.get('/api/users', (req, res) => {
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
});

// Serve static files from the frontend
app.get("/users", (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(rows);
    });
});



// Create a new user
app.post("/users", (req, res) => {
    const { username, password, email, nickName, phoneNumber, profilePic, imageUploaded } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    const query = `
        INSERT INTO users (username, password, email, nickName, phoneNumber, profilePic, imageUploaded)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [username, password, email, nickName, phoneNumber, profilePic, imageUploaded];

    db.run(query, params, function (err) {
        if (err) {
            console.error("Error inserting user:", err.message);
            return res.status(500).json({ message: "Failed to save user." });
        }

        // Return the new user ID
        res.status(201).json({ message: "User created successfully", userId: this.lastID });
    });
});



// Test endpoint (keep for now)
app.post('/API/populate-users', (req, res) => {
    console.log('POST /API/populate-users hit');
    res.send('Hello world');
});



// Debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});



// Serve the frontend index.html
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error('Server error:', err);
});



// Your server should handle these routes:
app.put('/users/:id', (req, res) => {
    // Update user by ID
});



// Delete nickname
app.post('/users/generate-mock', (req, res) => {
    // Generate mock users
});



// Logout endpoint (optional, can be used to clear session)
app.post('/logout', (req, res) => {
    // Optional: Handle logout logic
});