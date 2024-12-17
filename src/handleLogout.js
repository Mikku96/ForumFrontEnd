import { messageReceiver } from "./main.js";

// Replaces the login box with a logout box
export function showLogoutBox(username) {
    const loginContainer = document.getElementById("loginContainer");

    const logoutContainer = document.createElement("div");
    const logoutText = document.createElement("p");
    const logoutButton = document.createElement("button");
    logoutText.innerHTML = `Logged in as ${username}`;
    logoutButton.innerHTML = "Log out";

    logoutContainer.setAttribute("id", 'logoutContainer');
    logoutText.setAttribute("id", 'logoutText');
    logoutButton.setAttribute("id", 'logoutButton');
    logoutContainer.appendChild(logoutText);
    logoutContainer.appendChild(logoutButton);

    loginContainer.replaceWith(logoutContainer);


    // Removes user info from browser memory and returns the original login box
    logoutButton.addEventListener('click', async () => {
        console.log("logging out");

        localStorage.removeItem("username");
        localStorage.removeItem("password");
        logoutContainer.replaceWith(loginContainer);

        await messageReceiver(0);
    })
}