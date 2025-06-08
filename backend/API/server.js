import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

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
        nickName: "",
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

// Initialize users on startup
initializeMockUsers();

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
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Don't send password back to client
        const { password: _, ...userWithoutPassword } = user;
        res.json({
            message: "Login successful",
            user: userWithoutPassword
        });
    } else {
        res.status(401).json({ error: "Invalid username or password" });
    }
});

// Get current user profile
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

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error('Server error:', err);
});