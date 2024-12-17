import { userKeys } from "../userKeys.js";
import { messageReceiver } from "./main.js";
import { displayError } from "./handleError.js";
import { showLogoutBox } from "./handleLogout.js";

// For checking if username and key match
const availableUsers = {
    "frodo": "FRODO_KEY",
    "sam": "SAM_KEY",
    "pippin": "PIPPIN_KEY",
    "merry": "MERRY_KEY",
    "gandalf": "GANDALF_KEY"
};

export const loginListener = async (event) => {
    event.preventDefault();

    // Check if already logged in when pressing "Login"
    // (this should never happen as the button is hidden when logged in)
    const loggedInUser = localStorage.getItem("username");
    if (loggedInUser !== null) {
        displayError("Already logged in");
        return;
    }

    const username = document.getElementById("usernameInput").value.toLowerCase();
    const password = document.getElementById("passwordInput").value;

    if (!Object.keys(availableUsers).includes(username)) {
        displayError("No such user exists");
        return;
    }

    // Gets the user key associated with given username from userKeys.js and compares it to password
    const currentUserKey = availableUsers[username];
    if (password === userKeys[currentUserKey]) {
        // Saves user info to browser memory
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
        console.log("Now logged in as", username);

        showLogoutBox(username);
        await messageReceiver();
    }
    else {
        displayError("Incorrect password");
    }
}