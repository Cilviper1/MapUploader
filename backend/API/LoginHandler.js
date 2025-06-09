// CLIENT-SIDE AUTHENTICATION HELPERS



// Fetch users from backend
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



// Save single user to backend
async function saveUserToBackend(user) {
    try {
        const response = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        const result = await response.json();

        if (response.ok) {
            console.log("User saved to backend:", result);
            return result;
        } else {
            throw new Error(result.message || "Failed to save user.");
        }
    } catch (error) {
        console.error("Error saving user to backend:", error);
        throw error;
    }
}



// Update user on backend
async function updateUserOnBackend(userId, updates) {
    try {
        const response = await fetch(`http://localhost:3000/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
        });

        const result = await response.json();

        if (response.ok) {
            console.log("User updated on backend:", result);
            return result;
        } else {
            throw new Error(result.message || "Failed to update user.");
        }
    } catch (error) {
        console.error("Error updating user on backend:", error);
        throw error;
    }
}



// Generate mock users on server
async function generateMockUsersOnServer() {
    try {
        const response = await fetch("http://localhost:3000/users/generate-mock", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const result = await response.json();

        if (response.ok) {
            console.log("Mock users generated on server:", result);
            return result;
        } else {
            throw new Error(result.message || "Failed to generate mock users.");
        }
    } catch (error) {
        console.error("Error generating mock users:", error);
        throw error;
    }
}

async function deleteAllUsers() {
    try {
        const response = await fetch("http://localhost:3000/users", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if (response.ok) {
            console.log("All users deleted:", result);
            return result;
        } else {
            throw new Error(result.message || "Failed to delete all users.");
        }
    } catch (error) {
        console.error("Error deleting all users:", error);
        throw error;
    }
}


// USER REGISTRATION
async function register(username, password) {
    if (!username || !password) {
        alert("Username and password are required.");
        return;
    }

    try {
        const newUser = {
            username,
            password,
            email: "",
            nickName: "",
            phoneNumber: null,
            profilePic: null,
            imageUploaded: null
        };

        const result = await saveUserToBackend(newUser);
        alert("Registration successful!");
        document.getElementById("registrationForm")?.reset();
        window.location.href = "Login.html";
    } catch (error) {
        alert(error.message || "Registration failed.");
    }
}



// USER LISTING
async function listAllUsers() {
    try {
        let users = await getUsersFromBackend();

        if (!Array.isArray(users) || users.length === 0) {
            console.log("No users found — generating mock users.");
            await generateMockUsersOnServer();
            users = await getUsersFromBackend();
        }

        users.forEach(user => {
            const imageStatus = user.imageUploaded ? "Yes" : "No";
            console.log(`ID: ${user.id}, Username: ${user.username}, Pass: ${user.password}, Email: ${user.email}, Nickname: ${user.nickName}, Phone: ${user.phoneNumber}, Image Uploaded: ${imageStatus}`);
        });
    } catch (error) {
        console.error("Error listing users:", error);
        alert("Failed to load users.");
    }
}



// LOGIN
async function login() {
    const username = document.getElementById("loginUser").value;
    const password = document.getElementById("loginPassword").value;

    if (!username || !password) {
        alert("Username and password are required.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (response.ok) {
            // Store user data locally for session management
            localStorage.setItem("loggedInUser", JSON.stringify(result.user));
            alert(`Welcome back, ${result.user.username}!`);
            window.location.href = "userHome.html";
        } else {
            alert(result.error || "Login failed.");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred during login.");
    }
}



// LOGOUT
async function logout() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    try {
        // Optional: Call server logout endpoint if you have one
        const response = await fetch("http://localhost:3000/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: loggedInUser?.id })
        });

        // Clear local session regardless of server response
        localStorage.removeItem("loggedInUser");
        alert(`Goodbye, ${loggedInUser ? loggedInUser.username : "User"}!`);
        window.location.href = "login.html";
    } catch (error) {
        console.error("Logout error:", error);
        // Still clear local session even if server call fails
        localStorage.removeItem("loggedInUser");
        alert(`Goodbye, ${loggedInUser ? loggedInUser.username : "User"}!`);
        window.location.href = "login.html";
    }
}



// NICKNAME MANAGEMENT
async function changeNickName(newNick) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser || !newNick.trim()) {
        alert("Missing user or nickname.");
        return;
    }

    try {
        const updatedUser = await updateUserOnBackend(loggedInUser.id, { nickName: newNick });

        // Update local session data
        loggedInUser.nickName = newNick;
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

        alert("Nickname updated!");
        displayNickname();
    } catch (error) {
        alert(error.message || "Failed to update nickname.");
    }
}



// DELETE NICKNAME
async function deleteNickName() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
        alert("No user logged in.");
        return;
    }

    try {
        const updatedUser = await updateUserOnBackend(loggedInUser.id, { nickName: "" });

        // Update local session data
        loggedInUser.nickName = "";
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

        alert("Nickname deleted!");
        displayNickname();
    } catch (error) {
        alert(error.message || "Failed to delete nickname.");
    }
}



// DISPLAY NICKNAME (remains synchronous as it only reads from localStorage)
function displayNickname() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
        const el = document.getElementById("displayName");
        if (el) el.textContent = user.nickName || user.username;
    }
}



// UPDATE EMAIL
async function updateEmail(newEmail) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser || !newEmail.trim()) {
        alert("Missing user or email.");
        return;
    }

    try {
        const updatedUser = await updateUserOnBackend(loggedInUser.id, { email: newEmail });

        // Update local session data
        loggedInUser.email = newEmail;
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

        alert("Email updated!");
    } catch (error) {
        alert(error.message || "Failed to update email.");
    }
}



// UPDATE PHONE NUMBER
async function updatePhoneNumber(newPhone) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
        alert("No user logged in.");
        return;
    }

    try {
        const updatedUser = await updateUserOnBackend(loggedInUser.id, { phoneNumber: newPhone });

        // Update local session data
        loggedInUser.phoneNumber = newPhone;
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

        alert("Phone number updated!");
    } catch (error) {
        alert(error.message || "Failed to update phone number.");
    }
}



// TEST LOGIN (for demo/testing)
async function testLogin() {
    const username = "1";
    const password = "1";

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem("loggedInUser", JSON.stringify(result.user));
            alert(`Welcome back, Test User.`);
            window.location.href = "userHome.html";
        } else {
            alert(result.error || "Test login failed.");
        }
    } catch (error) {
        console.error("Test login error:", error);
        alert("An error occurred during test login.");
    }
}



// UTILITY: Check if user is logged in
function isUserLoggedIn() {
    const user = localStorage.getItem("loggedInUser");
    return user !== null;
}



// UTILITY: Get current logged in user
function getCurrentUser() {
    const user = localStorage.getItem("loggedInUser");
    return user ? JSON.parse(user) : null;
}



// UTILITY: Redirect to login if not authenticated
function requireAuth() {
    if (!isUserLoggedIn()) {
        alert("Please log in to access this page.");
        window.location.href = "login.html";
        return false;
    }
    return true;
}