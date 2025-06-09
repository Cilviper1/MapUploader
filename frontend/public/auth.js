// CLIENT-SIDE AUTHENTICATION HELPERS

// In-memory storage for current user (replaces sessionStorage for artifacts)
let currentUserData = null;

// USER SESSION MANAGEMENT
function getCurrentUser() {
    return currentUserData;
}

function setCurrentUser(user) {
    currentUserData = user;
}

function clearCurrentUser() {
    currentUserData = null;
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

// REGISTRATION
async function register(username, password) {
    if (!username || !password) {
        throw new Error("Username and password are required.");
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Registration failed");
        }

        return data;
    } catch (error) {
        console.error('Registration error:', error);
        throw new Error("Registration failed: " + error.message);
    }
}

// SIGN UP (redirect to registration page)
function signUp() {
    window.location.href = "Register.html";
}

// LOGIN
async function login() {
    const username = document.getElementById("loginUser")?.value;
    const password = document.getElementById("loginPassword")?.value;

    if (!username || !password) {
        throw new Error("Please enter both username and password.");
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
            return data;
        } else {
            throw new Error(data.error || "Login failed");
        }
    } catch (error) {
        console.error('Login error:', error);
        throw new Error(error.message || "Login failed. Please try again.");
    }
}

// TEST LOGIN (for development)
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
            return data;
        } else {
            throw new Error(data.error || "Test login failed");
        }
    } catch (error) {
        console.error("Test login error:", error);
        throw new Error("Test login failed. Please try again.");
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
        throw new Error("Please log in first.");
    }

    if (!newNick.trim()) {
        throw new Error("Please enter a nickname.");
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
            return data;
        } else {
            throw new Error(data.error || "Failed to update nickname");
        }
    } catch (error) {
        console.error('Update nickname error:', error);
        throw new Error("Failed to update nickname. Please try again.");
    }
}

// DELETE NICKNAME
async function deleteNickName() {
    return await changeNickName("");
}

// DISPLAY NICKNAME
function displayNickname() {
    const user = getCurrentUser();
    if (user) {
        const el = document.getElementById("displayName");
        if (el) el.textContent = user.nickName || user.username;
    }
}

// LIST ALL USERS (for development)
async function listUsers() {
    try {
        const response = await fetch('/api/users');
        const data = await response.json();

        if (response.ok) {
            const users = data.users || data;
            console.log("=== ALL USERS ===");
            users.forEach(user => {
                const imageStatus = user.imageUploaded ? "Yes" : "No";
                console.log(`ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Nickname: ${user.nickName}, Phone: ${user.phoneNumber}, Image Uploaded: ${imageStatus}`);
            });
            alert(`Found ${users.length} users. Check console for details.`);
            return users;
        } else {
            throw new Error(data.error || "Failed to fetch users");
        }
    } catch (error) {
        console.error('List users error:', error);
        throw new Error("Failed to fetch users. Please try again.");
    }
}

// Alias for backward compatibility
const listAllUsers = listUsers;

// GENERATE RANDOM USERS (for testing)
async function generateRandomUsers(count = 5) {
    const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
    const createdUsers = [];

    try {
        for (let i = 0; i < count; i++) {
            const randomName = names[Math.floor(Math.random() * names.length)];
            const username = `${randomName.toLowerCase()}${Math.floor(Math.random() * 1000)}`;
            const password = 'password123'; // Default password for testing

            try {
                const user = await register(username, password);
                createdUsers.push(user);
            } catch (error) {
                console.warn(`Failed to create user ${username}:`, error.message);
            }
        }

        alert(`Generated ${createdUsers.length} random users. Check console for details.`);
        console.log('Generated users:', createdUsers);
        return createdUsers;
    } catch (error) {
        console.error('Generate users error:', error);
        throw new Error("Failed to generate users. Please try again.");
    }
}

// GET USERS FROM BACKEND (utility function)
async function getUsersFromBackend() {
    try {
        const response = await fetch("http://localhost:3000/users");
        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }
        const users = await response.json();
        return users;
    } catch (error) {
        console.error("Error fetching users from backend:", error);
        return [];
    }
}

// Export all functions that are imported in Login.html
export {
    getCurrentUser,
    setCurrentUser,
    clearCurrentUser,
    requireLogin,
    register,
    signUp,          // Now included
    login,
    testLogin,
    logout,
    changeNickName,
    deleteNickName,
    displayNickname,
    listUsers,       // Fixed naming
    listAllUsers,    // Keep for backward compatibility
    generateRandomUsers, // Now included
    getUsersFromBackend
};