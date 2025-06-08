// FRONTEND-SAFE USER STORAGE HELPERS
function getUsersFromLocalStorage() {
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

function saveUsersToLocalStorage(users) {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem("users", JSON.stringify(users));
    }
}

// GENERATE UNIQUE ID
function generateUniqueId() {
    const users = getUsersFromLocalStorage();
    return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
}

// USER REGISTRATION
function register(username, password) {
    if (!username || !password) {
        alert("Username and password are required.");
        return;
    }
    const users = getUsersFromLocalStorage();
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

// USER LISTING
function listAllUsers() {
    let users = getUsersFromLocalStorage();
    if (!Array.isArray(users) || users.length === 0) {
        console.log("No users found — generating mock users.");
        generateRandomUsers();
        users = getUsersFromLocalStorage();
    }
    users.forEach(user => {
        const imageStatus = user.imageUploaded ? "Yes" : "No";
        console.log(`ID: ${user.id}, Username: ${user.username}, Pass: ${user.password}, Email: ${user.email}, Nickname: ${user.nickName}, Phone: ${user.phoneNumber}, Image Uploaded: ${imageStatus}`);
    });
}

// LOGIN
function login() {
    const username = document.getElementById("loginUser").value;
    const password = document.getElementById("loginPassword").value;
    const users = getUsersFromLocalStorage();
    const match = users.find(user => user.username === username && user.password === password);

    if (match) {
        localStorage.setItem("loggedInUser", JSON.stringify(match));
        alert(`Welcome back, ${username}!`);
        window.location.href = "userHome.html"; // adjust if needed
    } else {
        alert("Invalid username or password.");
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
    const users = getUsersFromLocalStorage();
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

    const users = getUsersFromLocalStorage();
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
    const users = getUsersFromLocalStorage();
    const match = users.find(user => user.username === username && user.password === password);

    if (match) {
        localStorage.setItem("loggedInUser", JSON.stringify(match));
        alert(`Welcome back, Test User.`);
        window.location.href = "userHome.html"; // adjust if needed
    } else {
        alert("Invalid username or password.");
    }
}



/*

if (typeof localStorage !== 'undefined') {
    const users = localStorage.getItem(key)
    // rest of the code ...

}
// Array to store registered users
let users = getUsersFromLocalStorage();
console.log(users);


// Function to register a new user
function registerUser(a,b) {
    let users = getUsersFromLocalStorage();
    // Create a new user object with username and password
    const newUser = {
        id: users.length + 1,
        username: a,
        password: b,
        email: "",
        nickName: "",
        phoneNumber: null,
        profilePic: null,
        imageUploaded: null
    };
    users.push(newUser);
    saveUsersToLocalStorage(users);

}


function getUsersFromLocalStorage() {
    try {
        const storedUsers = typeof localStorage !== "undefined" ? localStorage.getItem("users") : null;
    } catch (error) {
        console.log("Error getting users from localStorage", error);
    }
    return storedUsers ? JSON.parse(storedUsers) : [];
}


// Function to save user data to localStorage
function saveUsersToLocalStorage(users) {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem("users", JSON.stringify(users));
    }

    // Create a new user object
    const newUser = {
        id: generateUniqueId(),
        username,
        email,
        password,
        nickName,
        phoneNumber,
        profilePic,
    };

    // Add the new user to the array
    users.push(newUser);
    console.log(users);
    saveUsersToLocalStorage(users);
    // Display success message (you can modify this as needed)
    alert("Registration successful!");

    // Clear the form
    document.getElementById("registrationForm").reset();
    window.location.href = ".../backend/Public/login.html";
}



// Function to check if the email is unique
function isEmailUnique(email) {
    return users.some((user) => user.email === email);
}


function listAllUsers() {
    let users = JSON.parse(localStorage.getItem("users"));

    if (!Array.isArray(users) || users.length === 0) {
        console.log("No users found — generating mock users.");
        generateRandomUsers();
        users = JSON.parse(localStorage.getItem("users"));
    }
    console.log("Listing Users:");
    users.forEach(user => {
        if (user.imageUploaded === null) {
            console.log(`ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Nickname: ${user.nickName}, Phone: ${user.phoneNumber}, "User has no image": ${user.imageUploaded ? "Yes" : "No"}`);
        } else {
            console.log(`ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Nickname: ${user.nickName}, Phone: ${user.phoneNumber}, "User has an uploaded image": ${user.imageUploaded ? "Yes" : "No"}`);
        }
    });
}


// Function to check if the phone number is unique
function isPhoneNumberUnique(phoneNumber) {
    return users.some((user) => user.phoneNumber === phoneNumber);
}



// Function to generate a unique ID (simple increment for demonstration purposes)
function generateUniqueId() {
    return users.length + 1;
}

function generateRandomUsers() {

    let users = [];
    if (typeof localStorage !== "undefined") {
        const storedUsers = localStorage.getItem("users");
        if (storedUsers) {
            try {
                const parsedUsers = JSON.parse(storedUsers);
                if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
                    console.log("Users already exist in localStorage. Skipping mock user generation.");
                    return;
                }
            }
            catch (e) {
                const firstNames = ["Alex", "Taylor", "Jordan", "Morgan", "Casey", "Jamie", "Riley", "Avery", "Charlie", "Skyler"];
                const lastNames = ["Smith", "Lee", "Davis", "Kim", "Brown", "Lopez", "Clark", "Patel", "Nguyen", "Harris"];
                const domains = ["example.com", "mail.com", "test.org", "mydomain.net"];

                const users = [];

                for (let i = 1; i <= 20; i++) {
                    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
                    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
                    const username = `${first.toLowerCase()}${last.toLowerCase()}${Math.floor(Math.random() * 1000)}`;
                    const email = `${username}@${domains[Math.floor(Math.random() * domains.length)]}`;
                    const imageUploaded = null; // Placeholder for image upload functionality
                    // Simulating image upload with a placeholder

                    users.push({
                        id: i,
                        username: username,
                        email: email,
                        nickName: "",
                        phoneNumber: null,
                        imageUploaded: imageUploaded,
                        password: 12345 // Default password for mock users
                    });
                }

                localStorage.setItem("users", JSON.stringify(users));
                console.log("20 mock users generated.");
            }
        }
    }

}

///login page
function login() {
    // Dummy login for testing
    const username = document.getElementById("loginUser").value;
    const password = document.getElementById("loginPassword").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const match = users.find(user => user.username === username);

    if (match) {
        alert(`Welcome back, ${username}!`);
        window.location.href = "userHome.html";     // Or your real homepage
    } else {
        alert("User not found.");
    }
}

function testLogin() {
    alert("Test login pressed.");
}


function redirectToLogin() {
    console.log("Redirecting to login...");
    window.location.href = "../backend/Public/Login.html"; // adjust path as needed
}

function testLogin() {
    console.log(users);
    const loginUser = "1"
    const loginPassword = "1"

    // Check if there is a user with the provided email

    const user = users.find((user) => user.username === loginUser);

    // If no user found or password is incorrect, show an alert
    if (!user || user.password !== loginPassword) {
        alert("Invalid email or password. Please try again.");
        return;
    }
    // If login is successful, store user information in sessionStorage
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    // If login is successful, redirect to another page (e.g., welcome.html)
    window.location.href = "/Public/userHome.html";
}



function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

const loggedInUser = typeof localStorage !== "undefined" ? JSON.parse(localStorage.getItem("loggedInUser")) : null;




function changeNickName(name) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const newName1 = name

    if (!loggedInUser) {
        alert("No user is currently logged in.");
        return;
    }

    if (!newName1.trim()) {
        alert("Please enter a valid nickname.");
        return;
    }

    // Update the nickname of the logged-in user
    loggedInUser.nickName = newName1;
    console.log(name.value);
    console.log(loggedInUser.nickName);

    // Update the users array
    const userIndex = users.findIndex((user) => user.id === loggedInUser.id);
    if (userIndex !== -1) {
        users[userIndex].nickName = newName1;
        saveUsersToLocalStorage(users);
    }

    // Update the logged-in user in localStorage
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

    // Display the updated nickname
    displayUsername();
    alert("Nickname updated successfully!");
}


function displayUsername() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
        document.getElementById("displayName").textContent = loggedInUser.nickName;
    }
}
}
    }   
*/