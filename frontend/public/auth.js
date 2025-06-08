// CLIENT-SIDE AUTHENTICATION HELPERS

// Store current user in sessionStorage (better than localStorage for sessions)
function getCurrentUser() {
    const user = sessionStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
}

function clearCurrentUser() {
    sessionStorage.removeItem('currentUser');
}

// REGISTRATION
const db = require("../storage/db");

function register(username, password, callback) {
    if (!username || !password) {
        return callback("Username and password are required.");
    }

    const query = "INSERT INTO users (username, password, email, nickName, phoneNumber, profilePic, imageUploaded) VALUES (?, ?, '', '', NULL, NULL, NULL)";

    db.run(query, [username, password], function (err) {
        if (err) {
            return callback("Registration failed: " + err.message);
        }
        callback(null, { id: this.lastID, username });
    });
}

module.exports = register;

// LOGIN
async function login() {
    const username = document.getElementById("loginUser").value;
    const password = document.getElementById("loginPassword").value;

    if (!username || !password) {
        alert("Please enter both username and password.");
        return;
    }

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            setCurrentUser(data.user);
            alert(`Welcome back, ${username}!`);
            window.location.href = "userHome.html";
        } else {
            alert(data.error || "Login failed");
        }
    } catch (error) {
        console.error('Login error:', error);
        alert("Login failed. Please try again.");
    }
}

// LOGOUT
function logout() {
    clearCurrentUser();
    window.location.href = "Login.html";
}

// UPDATE NICKNAME
async function changeNickName(newNick) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert("Please log in first.");
        return;
    }

    if (!newNick.trim()) {
        alert("Please enter a nickname.");
        return;
    }

    try {
        const response = await fetch(`/api/user/${currentUser.id}/nickname`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nickName: newNick })
        });

        const data = await response.json();

        if (response.ok) {
            setCurrentUser(data.user);
            alert("Nickname updated!");
            displayNickname();
        } else {
            alert(data.error || "Failed to update nickname");
        }
    } catch (error) {
        console.error('Update nickname error:', error);
        alert("Failed to update nickname. Please try again.");
    }
}

// DELETE NICKNAME
async function deleteNickName() {
    await changeNickName("");
}

// DISPLAY NICKNAME
function displayNickname() {
    const user = getCurrentUser();
    if (user) {
        const el = document.getElementById("displayName");
        if (el) el.textContent = user.nickName || user.username;
    }
}

// CHECK IF USER IS LOGGED IN (for protected pages)
function requireLogin() {
    const user = getCurrentUser();
    if (!user) {
        alert("Please log in to access this page.");
        window.location.href = "Login.html";
        return false;
    }
    return true;
}

// DEBUG FUNCTIONS (for development)

// List all users
async function listAllUsers() {
    try {
        const response = await fetch('/api/users');
        const users = await response.json();

        if (response.ok) {
            console.log("=== ALL USERS ===");
            users.forEach(user => {
                const imageStatus = user.imageUploaded ? "Yes" : "No";
                console.log(`ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Nickname: ${user.nickName}, Phone: ${user.phoneNumber}, Image Uploaded: ${imageStatus}`);
            });
            alert(`Found ${users.length} users. Check console for details.`);
        } else {
            alert("Failed to fetch users");
        }
    } catch (error) {
        console.error('List users error:', error);
        alert("Failed to fetch users. Please try again.");
    }
}

// TEST LOGIN (keep for testing)
async function testLogin() {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: "1", password: "1" })
        });

        const data = await response.json();

        if (response.ok) {
            setCurrentUser(data.user);
            alert("Welcome back, Test User!");
            window.location.href = "userHome.html";
        } else {
            alert(data.error || "Test login failed");
        }
    } catch (error) {
        console.error('Test login error:', error);
        alert("Test login failed. Please try again.");
    }
}

