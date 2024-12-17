import { readToMessageBox } from './generateMessageBox.js';
import { deleteListener } from './handleDelete.js';
import { editListener } from './handleEdit.js';

const messagesPerPage = 10;

// Creates message HTML and adds it to the main message view
function appendMessageToView(messageObject, target, index) {
    const messagesDiv = target;

    const messageContainer = document.createElement("div");
    messageContainer.setAttribute("id", "messageContainer");
    messageContainer.setAttribute("class", "singleMessageBox");

    const messageHeader = document.createElement("div");
    messageHeader.setAttribute("class", "divider");
    messageHeader.innerHTML = `#${messageObject.message_id}`;

    readToMessageBox(messageObject, messageContainer);

    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("messageModButtons");

    // Adds delete and edit buttons only for messages owned by the currently logged in user
    const username = localStorage.getItem("username");
    if (username === messageObject.sender_name.toLowerCase()) {
        const deleteButton = document.createElement("button");
        const editButton = document.createElement("button");
        editButton.innerHTML = "Edit";
        deleteButton.innerHTML = "Delete";

        // Current page index is passed to the listener functions so it's retained on message edit/delete
        deleteButton.addEventListener('click', () => {
            deleteListener(messageObject.sender_key, messageObject.message_id, index);
        });
        editButton.addEventListener('click', () => {
            editListener(messageContainer, messageObject.sender_key, messageObject.message_id, index);
        });

        editButton.setAttribute("class", 'editDeleteButton'); // edit and delete share class
        deleteButton.setAttribute("class", 'editDeleteButton');

        editButton.setAttribute("id", `editButton ${messageObject.message_id}`);
        deleteButton.setAttribute("id", `deleteButton ${messageObject.message_id}`);

        buttonsDiv.appendChild(deleteButton);
        buttonsDiv.appendChild(editButton);
    }

    messageContainer.appendChild(buttonsDiv);
    messagesDiv.appendChild(messageHeader);
    messagesDiv.appendChild(messageContainer);
}

function createMessageView() {
    const allMessagesDiv = document.createElement("div");
    allMessagesDiv.setAttribute("id", "allMessagesContainer");

    // Creates a display for deselecting the team or user whose messages are currently being shown,
    // added to the top of the main message view (functionality in main.js)
    const parameters = document.createElement("div");

    const usernameDiv = document.createElement("div");
    usernameDiv.setAttribute("id", "selectedUser");
    const crossUser = document.createElement("button");
    crossUser.setAttribute("class", "parametersChild");
    crossUser.setAttribute("id", "crossUser");
    crossUser.innerHTML = "&#10060";
    usernameDiv.setAttribute("class", "parametersChild");

    parameters.appendChild(usernameDiv);
    parameters.appendChild(crossUser);
    parameters.setAttribute("class", "parameters");
    allMessagesDiv.appendChild(parameters);

    const teamDiv = document.createElement("div");
    teamDiv.setAttribute("id", "selectedTeam");
    const crossTeam = document.createElement("button");
    crossTeam.setAttribute("class", "parametersChild");
    crossTeam.setAttribute("id", "crossTeam");
    crossTeam.innerHTML = "&#10060";
    teamDiv.setAttribute("class", "parametersChild");

    parameters.appendChild(teamDiv);
    parameters.appendChild(crossTeam);
    parameters.setAttribute("class", "parameters");
    allMessagesDiv.appendChild(parameters);

    return allMessagesDiv;
}

function showMessages(messages, index) {
    const indexButtonCount = (messages.length - messages.length % messagesPerPage) / messagesPerPage + 1;

    removeMessages();
    const allMessagesDiv = createMessageView();

    // If not on last page, shows max number of messages
    if (index !== (indexButtonCount - 1)) {
        messages.slice(index * messagesPerPage, (index + 1) * messagesPerPage)
            .forEach(messageObject => {
                appendMessageToView(messageObject, allMessagesDiv, index);
            });
    }
    else { // Else shows only as many messages as are left
        messages.slice(index * messagesPerPage, index * messagesPerPage + messages.length % messagesPerPage)
            .forEach(messageObject => {
                appendMessageToView(messageObject, allMessagesDiv, index);
            });
    }

    const container = document.getElementById("posts");
    container.appendChild(allMessagesDiv);
}

function filterMessages(messages, team = "all") {
    const teams = {
        "green": ["Aragorn", "Legolas", "Gimli", "Boromir", "Sauron"],
        "blue": ["Galadriel", "Saruman", "Faramir", "Gothmog", "Gollum"],
        "red": ["Frodo", "Sam", "Pippin", "Merry", "Gandalf"]
    };

    if (team === "all") {
        return messages;
    }
    else {
        return messages.filter(message => (teams[team].includes(message.sender_name)));
    }
}

// For removing previous message list before creating a new one during page change
function removeMessages() {
    if (document.getElementById("allMessagesContainer") !== null)
        document.getElementById("allMessagesContainer").remove();
}

export { showMessages, filterMessages };