// FRONTEND-SAFE USER STORAGE HELPERS
/*
function getUsersFromBackend() {
    if (typeof localStorage !== "undefined") {
        try {
            const storedUsers = localStorage.getItem("users");
            return storedUsers ? JSON.parse(storedUsers) : [];
        } catch (error) {
            console.error("Error parsing users from localStorage:", error);
        }
    }
    return [];
}
*/
// CLIENT-SIDE AUTHENTICATION HELPERS
// Fetch users from backend or localStorage
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
        return [users];
    }
}


// Save users to localStorage
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
        } else {
            alert(result.message || "Failed to save user.");
        }
    } catch (error) {
        console.error("Error saving user to backend:", error);
        alert("An error occurred while saving the user.");
    }
}



// USER REGISTRATION
function register(username, password) {
    if (!username || !password) {
        alert("Username and password are required.");
        return;
    }
    const users = getUsersFromBackend();
    const newUser = {
        id: generateUniqueId(),
        username,
        password,
        email: "",
        nickName: "",
        phoneNumber: null,
        profilePic: null,
        imageUploaded: null
    };
    users.push(newUser);
    saveUsersToLocalStorage(users);
    alert("Registration successful!");
    document.getElementById("registrationForm")?.reset();
    window.location.href = "Login.html"; // adjust if needed
}

// GENERATE UNIQUE ID
function generateUniqueId() {
    const users = getUsersFromBackend();
    return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
}

// USER LISTING
function listAllUsers() {
    let users = getUsersFromBackend();
    if (!Array.isArray(users) || users.length === 0) {
        console.log("No users found — generating mock users.");
        generateRandomUsers();
        users = getUsersFromBackend();
    }
    users.forEach(user => {
        const imageStatus = user.imageUploaded ? "Yes" : "No";
        console.log(`ID: ${user.id}, Username: ${user.username}, Pass: ${user.password}, Email: ${user.email}, Nickname: ${user.nickName}, Phone: ${user.phoneNumber}, Image Uploaded: ${imageStatus}`);
    });
}

// LOGIN
async function login() {
    const username = document.getElementById("loginUser").value;
    const password = document.getElementById("loginPassword").value;

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
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}

// NICKNAME MANAGEMENT
function changeNickName(newNick) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser || !newNick.trim()) {
        alert("Missing user or nickname.");
        return;
    }
    const users = getUsersFromBackend();
    const idx = users.findIndex(user => user.id === loggedInUser.id);
    if (idx !== -1) {
        users[idx].nickName = newNick;
        loggedInUser.nickName = newNick;
        saveUsersToLocalStorage(users);
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
        alert("Nickname updated!");
        displayNickname();
    }
}

// NICKNAME MANAGEMENT
function deleteNickName() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const users = getUsersFromBackend();
    const idx = users.findIndex(user => user.id === loggedInUser.id);
    if (idx !== -1) {
        users[idx].nickName = "";
        loggedInUser.nickName = ""
        saveUsersToLocalStorage(users);
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
        alert("Nickname deleted!");
        displayNickname();
    }
}

function displayNickname() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
        const el = document.getElementById("displayName");
        if (el) el.textContent = user.nickName;
    }
}

// MOCK USERS
function generateRandomUsers() {
    const firstNames = ["Alex", "Taylor", "Jordan", "Morgan", "Casey", "Jamie", "Riley", "Avery", "Charlie", "Skyler"];
    const lastNames = ["Smith", "Lee", "Davis", "Kim", "Brown", "Lopez", "Clark", "Patel", "Nguyen", "Harris"];
    const domains = ["example.com", "mail.com", "test.org", "mydomain.net"];

    const users = [];

    for (let i = 1; i <= 20; i++) {
        let username, password, email;
        if (i === 1) {
            username = "1";
            password = "1";
            email = "1@test.test";
        } else {
            const first = firstNames[Math.floor(Math.random() * firstNames.length)];
            const last = lastNames[Math.floor(Math.random() * lastNames.length)];
            username = `${first.toLowerCase()}${last.toLowerCase()}${Math.floor(Math.random() * 1000)}`;
            password = "1";
            console.log(`Generating user ${i}: ${first} ${last} ${password}`);
            email = `${username}@${domains[Math.floor(Math.random() * domains.length)]}`;
        }
        users.push({
            id: i,
            username,
            email,
            password,
            nickName: "",
            phoneNumber: null,
            profilePic: null,
            imageUploaded: null
        });
    }
    saveUsersToLocalStorage(users);
    console.log("20 mock users and test user generated.");
}

// TEST LOGIN (for demo/testing)
function testLogin() {
    const username = "1";
    const password = "1";
    const users = getUsersFromBackend();
    const match = users.find(user => user.username === username && user.password === password);

    if (match) {
        localStorage.setItem("loggedInUser", JSON.stringify(match));
        alert(`Welcome back, Test User.`);
        window.location.href = "userHome.html"; // adjust if needed
    } else {
        alert("Invalid username or password.");
    }
}