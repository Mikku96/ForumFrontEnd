import { updateMessage } from "./apiRequests.js";
import { messageReceiver } from "./main.js";

export const editListener = async (msgDiv, senderKey, id, currentIndex) => {
    const userKey = localStorage.getItem("password");

    // Replaces the normal message box with a text field for editing the message text
    if (userKey === senderKey) {
        const messageBox = msgDiv.querySelector('#messageBox');
        const oldMsgText = msgDiv.querySelector('#messageText').innerHTML;

        const deleteButton = document.getElementById(`deleteButton ${id}`);
        const editButton = document.getElementById(`editButton ${id}`);
        deleteButton.style.visibility = 'hidden';
        editButton.style.visibility = 'hidden';

        const editMessageBox = document.createElement("div");
        const textarea = document.createElement("textarea");
        textarea.value = oldMsgText;
        textarea.style.width = `${messageBox.clientWidth}px`;
        textarea.style.height = `${messageBox.scrollHeight}px`;
        textarea.style.margin = "10px";

        // Creates "Send" and "Cancel" buttons for use during editing
        const buttonsDiv = document.createElement("div");
        const sendButton = document.createElement("button");
        const cancelButton = document.createElement("button");

        sendButton.innerHTML = "Send";
        cancelButton.innerHTML = "Cancel";
        sendButton.setAttribute("class", 'editDeleteButton');
        cancelButton.setAttribute("class", 'editDeleteButton');
        buttonsDiv.classList.add("messageModButtons");

        buttonsDiv.appendChild(sendButton);
        buttonsDiv.appendChild(cancelButton);
        editMessageBox.appendChild(textarea);
        editMessageBox.appendChild(buttonsDiv);
        messageBox.replaceWith(editMessageBox);


        sendButton.addEventListener('click', async () => {
            const messageText = textarea.value;
            await updateMessage(userKey, id, { message: messageText });
            console.log("Updated message sent");

            // Returns original message box and buttons
            editMessageBox.replaceWith(messageBox);
            deleteButton.style.visibility = 'visible';
            editButton.style.visibility = 'visible';

            await messageReceiver(currentIndex);
        })

        cancelButton.addEventListener('click', () => {
            console.log("Cancelled");

            // Returns original message box and buttons
            editMessageBox.replaceWith(messageBox);
            deleteButton.style.visibility = 'visible';
            editButton.style.visibility = 'visible';
        })
    }
    else {
        window.alert("Not authorised");
    }
}