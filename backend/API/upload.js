// Assuming checkIfLoggedIn returns parsed user object or null
function checkIfLoggedIn() {
    const userStr = localStorage.getItem("loggedInUser");
    return userStr ? JSON.parse(userStr) : null;
}

// Display username or nickname on welcome page
function displayUsername() {
    const user = checkIfLoggedIn();
    const welcomeMessage = document.getElementById("userName");
    if (user && welcomeMessage) {
        welcomeMessage.innerText = "Welcome, " + (user.nickName || user.username || "") + "!";
    }
}

// Display user's profile picture
function displayProfilePicture() {
    const user = checkIfLoggedIn();
    const profilePicture = document.getElementById("profilePicture");

    if (user && profilePicture) {
        // Use user.imageUploaded or user.profilePic if exists
        profilePicture.src = user.imageUploaded || user.profilePic || "";
    }
}



// Convert image element to base64 string
function getBase64Image(imgElement) {
    const canvas = document.createElement("canvas");
    canvas.width = imgElement.naturalWidth || imgElement.width;
    canvas.height = imgElement.naturalHeight || imgElement.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imgElement, 0, 0);
    return canvas.toDataURL("image/png");
}

// Set profile picture and update localStorage
function setProfilePicture() {
    let userStr = localStorage.getItem("loggedInUser");
    if (!userStr) {
        alert("No logged-in user found.");
        return;
    }
    const user = JSON.parse(userStr);

    const uploadedImage = document.getElementById("uploadedImage");
    if (!uploadedImage) {
        alert("No uploaded image found.");
        return;
    }

    const base64String = getBase64Image(uploadedImage);
    user.imageUploaded = base64String;

    // Update users array in localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
        users[index].imageUploaded = base64String;
        localStorage.setItem("users", JSON.stringify(users));
    }

    // Update logged-in user in localStorage
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    alert("Image is now set as profile photo");
}

// Handle image upload input
function uploadImage() {
    const imageInput = document.getElementById("imageInput");
    const uploadedImage = document.getElementById("uploadedImage");

    if (imageInput && imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            if (uploadedImage) {
                uploadedImage.src = e.target.result;

                uploadedImage.onload = function () {
                    // Save base64 in loggedInUser.imageUploaded temporarily
                    const base64Img = getBase64Image(uploadedImage);

                    let user = checkIfLoggedIn();
                    if (user) {
                        user.imageUploaded = base64Img;
                        localStorage.setItem("loggedInUser", JSON.stringify(user));
                        console.log("Image saved to loggedInUser in localStorage.");
                    }
                };
            }
        };

        reader.readAsDataURL(imageInput.files[0]);
    } else {
        alert("Please select an image to upload.");
    }
}

// Enable resizing of the image while maintaining aspect ratio
function enableImageResizing() {
    const uploadedImage = document.getElementById("uploadedImage");

    if (!uploadedImage) return;

    let isResizing = true;
    let startX, startY, startWidth, startHeight;

    uploadedImage.style.position = "relative";
    uploadedImage.style.cursor = "nwse-resize";

    uploadedImage.addEventListener("mousedown", (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = uploadedImage.offsetWidth;
        startHeight = uploadedImage.offsetHeight;
        e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
        if (isResizing) {
            const dx = (e.clientX - startX) * 1.618034;
            const aspectRatio = startWidth / startHeight;
            let newWidth = startWidth + dx;
            let newHeight = newWidth / aspectRatio;

            uploadedImage.style.width = newWidth + "px";
            uploadedImage.style.height = newHeight + "px";
        }
    });

    document.addEventListener("mouseup", () => {
        isResizing = false;
    });
}

// Render uploaded profile image if available
function checkAndRenderUploadedImage() {
    const loggedInUser = checkIfLoggedIn();
    if (!loggedInUser) {
        console.warn("No logged-in user found.");
        return;
    }

    if (loggedInUser.imageUploaded && typeof loggedInUser.imageUploaded === "string") {
        const uploadedImage = document.getElementById("uploadedImage");
        if (uploadedImage) {
            uploadedImage.src = loggedInUser.imageUploaded;
            uploadedImage.style.display = "block";
        }
    } else {
        console.log("No image uploaded for this user.");
    }
}
