import { getAllMessages, postNewMessage } from './apiRequests.js';
import { showMessages, filterMessages } from './messageManager.js';
import { makeButtons } from './generateButtons.js';
import { displayError } from './handleError.js';


const allMessagesButton = document.getElementById("allMessages");
const redTeamButton = document.getElementById("redTeamMessages");
const blueTeamButton = document.getElementById("blueTeamMessages");
const greenTeamButton = document.getElementById("greenTeamMessages");

let selectedTeam = "all";
allMessagesButton.addEventListener("click", async () => {
    selectedTeam = "all";
    await messageReceiver(0);
});
redTeamButton.addEventListener("click", async () => {
    selectedTeam = "red";
    await messageReceiver(0);
});
blueTeamButton.addEventListener("click", async () => {
    selectedTeam = "blue";
    await messageReceiver(0);
});
greenTeamButton.addEventListener("click", async () => {
    selectedTeam = "green";
    await messageReceiver(0);
});

let selectedUser = "";

let newestFirst = false;
const radioOldest = document.getElementById("oldest");
const radioNewest = document.getElementById("newest");
radioOldest.addEventListener("change", async () => {
    newestFirst = false;
    await messageReceiver(0);
});
radioNewest.addEventListener("change", async () => {
    newestFirst = true;
    await messageReceiver(0);
});

let lastIndex = 0;


const messagesPerPage = 10;

// Main function for receiving and displaying messages from backend
export async function messageReceiver(currentIndex = 0, updateLastIndex = false) {
    let messages = await getAllMessages();

    // Shows all messages or only for selected team
    messages = filterMessages(messages, selectedTeam);

    if (selectedUser !== "")
        messages = messages.filter(message => message.sender_name === selectedUser);

    if (newestFirst === true)
        messages = messages.reverse();

    // Used when posting a new message so application switches to the last message page,
    // used by sendButton's event listener
    lastIndex = Math.ceil(messages.length / messagesPerPage) - 1;
    // Updates lastIndex if user is viewing a filtered list of messages and makes a new post
    if (updateLastIndex)
        currentIndex = lastIndex;
    // Moves back one page if user just deleted the only message from the last page
    if (currentIndex > lastIndex)
        currentIndex = lastIndex;

    makeButtons(messages, currentIndex);
    showMessages(messages, currentIndex, selectedUser);
    showDeselectButtons();
}

await messageReceiver();



//####################################################
//#################### LOG IN ########################
//####################################################

import { loginListener } from './handleLogin.js';
import { showLogoutBox } from './handleLogout.js';

const loggedInUser = localStorage.getItem("username");
if (loggedInUser !== null) {
    console.log("Already logged in as", loggedInUser);
    showLogoutBox(loggedInUser);
}
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", loginListener);


//####################################################
//############## POST NEW MESSAGE ####################
//####################################################

const sendButton = document.getElementById("sendButton");
sendButton.addEventListener('click', async () => {
    const userPassword = localStorage.getItem("password");
    const newMsgText = document.getElementById("textInputArea").value;

    if (userPassword) {
        await postNewMessage(userPassword, { message: newMsgText });
        selectedTeam = "all";
        selectedUser = "";
        await messageReceiver(lastIndex, true);
        document.querySelector(".pageNav.end").scrollIntoView(false);
    }
    else {
        displayError("Not logged in");
    }

    document.getElementById("textInputArea").value = "";
});


//####################################################
//########### SHOW A USER'S ALL MESSAGES #############
//####################################################

// When clicking the name of a user in the message view (used in generateMessageBox.js)
export function clickUserListener(event) {
    const targetUser = event.srcElement.innerText;
    selectedUser = targetUser;
    messageReceiver(0);
}


//####################################################
//###### SHOW BUTTONS FOR DESELECTING USER/TEAM ######
//####################################################

function showDeselectButtons() {
    const crossTeam = document.getElementById("crossTeam");
    if (selectedTeam === "all") {
        crossTeam.style.display = "none";
    }
    else {
        const div = document.getElementById("selectedTeam");
        div.innerHTML = "Chosen team: " + selectedTeam;
        crossTeam.addEventListener("click", async () => {
            selectedTeam = "all";
            await messageReceiver(0);
        });
    }

    const crossUser = document.getElementById("crossUser");
    if (selectedUser === "") {
        crossUser.style.display = "none";
    }
    else {
        const div = document.getElementById("selectedUser");
        div.innerHTML = "Chosen user: " + selectedUser;
        crossUser.addEventListener("click", async () => {
            selectedUser = "";
            await messageReceiver(0);
        });
    }
}


//####################################################
//###### SHOW A SINGLE MESSAGE FROM SEARCH BOX #######
//####################################################

import { dialogListener } from './displayMessageById.js';

const submitIDSearch = document.querySelector("#submitIDSearch");
const closeButton = document.querySelector("#dialogCloseButton");
const dialog = document.querySelector("#dialogForSingleMessage");

submitIDSearch.addEventListener("click", dialogListener);

closeButton.addEventListener("click", () => {
    dialog.close();
    document.getElementById("singleMessageBox").remove();
});


//####################################################
//############### GO TO TOP OF PAGE ##################
//####################################################

const toTopButton = document.querySelector("#toTopButton");
toTopButton.addEventListener("click", () => {
    window.location.href = '#topLogo';
});