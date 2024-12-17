import { deleteMessage } from "./apiRequests.js";
import { messageReceiver } from "./main.js";

export const deleteListener = async (senderKey, id, currentIndex) => {
    const userKey = localStorage.getItem("password");
    if (userKey === senderKey) {
        await deleteMessage(userKey, id);
        console.log("Deleted message ", id);

        await messageReceiver(currentIndex);
    }
    else {
        window.alert("Not authorised");
    }
}