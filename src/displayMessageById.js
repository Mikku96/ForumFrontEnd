import { getSingleMessage } from './apiRequests.js';
import { readToMessageBox } from './generateMessageBox.js';
import { displayError } from './handleError.js';

// Displays the requested message as a dialog
export async function dialogListener() {
    const inputID = Number(document.getElementById("searchIDInput").value);

    if (isNaN(inputID) === true) {
        displayError("Input must be a number");
        return;
    }
    const messageToDisplay = await getSingleMessage(inputID);
    if (messageToDisplay.length === 0) {
        displayError("No such ID in database");
        return;
    }
    const messageDiv = document.querySelector("#dialogMessageContainer");

    const messageContainer = document.createElement("div");
    messageContainer.setAttribute("id", "singleMessageBox");
    messageContainer.setAttribute("class", "singleMessageBox");

    readToMessageBox(messageToDisplay[0], messageContainer);

    messageDiv.style.width = "1200px";
    messageDiv.appendChild(messageContainer);

    const dialog = document.querySelector("#dialogForSingleMessage");
    dialog.showModal();
}