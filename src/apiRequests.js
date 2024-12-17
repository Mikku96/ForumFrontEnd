import { displayError } from './handleError.js';

const baseURL = 'https://starttipakettiforumapi.azurewebsites.net';

async function getAllMessages() {
    try {
        const response = await axios.get(baseURL + '/allMessages');
        return response.data;
    }
    catch {
        displayError("Error with fetching all messages, is the server down?");
    }
}

async function getSingleMessage(id) {
    try {
        const response = await axios.get(baseURL + `/singleMessage/${id}`);
        return response.data;
    }
    catch {
        displayError("Error with fetching a single message, is the server down?");
    }
}

async function postNewMessage(userKey, message) {
    try {
        const response = await axios.post(baseURL + '/newMessage', message, {
            headers: { 'userkey': userKey }
        })
        console.log(response.data);
    }
    catch {
        displayError("Error with posting a new message, is the server down?");
    }
}

async function deleteMessage(userKey, id) {
    try {
        const response = await axios.delete(baseURL + `/deleteMessage/${id}`, {
            headers: { 'userkey': userKey }
        })
        console.log(response.data);
    }
    catch {
        displayError("Error with deleting the message, is the server down?");
    }
}

async function updateMessage(userKey, id, message) {
    try {
        const response = await axios.put(baseURL + '/modifyMessage', { ...message, 'id': id }, {
            headers: { 'userkey': userKey }
        })
        console.log(response.data);
    }
    catch {
        displayError("Error with updating the message, is the server down?");
    }
}

export { getAllMessages, getSingleMessage, postNewMessage, deleteMessage, updateMessage };