import { sanitize } from './sanitizeUserInput.js';
import { clickUserListener } from './main.js';

// Formats message contents received from backend into variables to display
function formatMessage(message) {
    const senderName = message.sender_name;
    const content = sanitize(message.content);

    let timestamp = new Date(message.timestamp).toLocaleString();
    timestamp = timestamp.split("klo")
        .map((part, index) => index === 0 ? part : (part.replaceAll(".", ":")))
        .join("klo").replace("klo", " ");
    const timeWithoutSecs = timestamp.substring(0, timestamp.length - 3);

    // Additional relative time display appended to timestamp (e.g. "2 days ago")
    const timeDifference = Date.now() - new Date(message.timestamp).getTime();
    const timeDifferenceDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    let timeDiffString = "";
    if (timeDifferenceDays < 1) {
        const timeDifferenceHours = Math.floor(timeDifference / (1000 * 60 * 60));
        timeDiffString = timeDifferenceHours === 1 ? "(1 hour ago)" : `(${timeDifferenceHours} hours ago)`;
        if (timeDifferenceHours <= 0) {
            const timeDifferenceMinutes = Math.floor(timeDifference / (1000 * 60));
            timeDiffString = timeDifferenceMinutes === 1 ? "(1 minute ago)" :
                `(${timeDifferenceMinutes} minutes ago)`;
        }
    }
    else if (timeDifferenceDays === 1)
        timeDiffString = "(1 day ago)";
    else
        timeDiffString = `(${timeDifferenceDays} days ago)`;

    return [senderName, timeWithoutSecs, content, timeDiffString];
}

// Renders message contents and timestamp into a HTML message display,
// used both in the main message view and when looking up individual messages
function readToMessageBox(messageObject, parent) {
    const [senderName, timeWithoutSecs, content, timeDiffString] = formatMessage(messageObject);

    const flexContainer = document.createElement("div");
    flexContainer.setAttribute("class", "flex");

    // Profile name and image
    const profileContainer = document.createElement("div");
    profileContainer.setAttribute("id", "profileContainer");
    const profilePicture = document.createElement("div");
    profilePicture.setAttribute("id", "profilePicture");
    const userName = document.createElement("div");
    userName.setAttribute("class", "userName");
    userName.innerHTML = senderName;
    userName.addEventListener("click", clickUserListener);

    const profileImage = document.createElement("img");

    profileImage.setAttribute("src", `../images/${senderName.toLowerCase()}.png`);
    profileImage.onerror = function () {
        profileImage.setAttribute("src", `../images/blank.png`);
    }
    profileImage.setAttribute("width", "150px");
    profileImage.setAttribute("height", "150px");

    profilePicture.appendChild(profileImage);

    // Message timestamp and text content
    const messageBox = document.createElement("div");
    messageBox.setAttribute("id", "messageBox");
    messageBox.setAttribute("class", "flex_item");

    const timestampDisplay = document.createElement("p");
    const horizontalLine = document.createElement("hr");
    const messageContent = document.createElement("p");
    timestampDisplay.setAttribute("id", "timestamp");
    messageContent.setAttribute("id", "messageText");
    timestampDisplay.innerHTML = `${timeWithoutSecs} ${timeDiffString}`;
    messageContent.innerHTML = content;
    // Forcibly break and wrap long strings so they don't escape the message box
    messageBox.style.textWrap = "break-word";
    messageBox.style.wordBreak = "break-word";
    messageBox.appendChild(timestampDisplay);
    messageBox.appendChild(horizontalLine);
    messageBox.appendChild(messageContent);

    profileContainer.appendChild(profilePicture);
    profileContainer.appendChild(userName);

    flexContainer.appendChild(profileContainer);
    flexContainer.appendChild(messageBox);
    parent.appendChild(flexContainer);
}

export { readToMessageBox };