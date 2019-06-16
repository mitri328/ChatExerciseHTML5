import {getUser, UserList} from "./WebAPIUsers.js";

export async function getMessage(message_id) {

    let getMessage = await fetch('https://chat.humbapa.ch/api/messages/' + message_id, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });

    let data = await getMessage;

    // Success
    if (getMessage.status === 200) {
        let dataJson = await data.json();

        // Get user from the list, if not found get from Web API
        var users = UserList.filter((item) => item.Id === dataJson.user_id);
        let user =  users[0];
        if (!user) {// not found in Array list
            console.log('user Not found In List');
            user = await getUser(dataJson.user_id);
        }
        return getMessageFromJson(dataJson, user.nickname);
    } else {
        console.log('Unable to get message ' + message_id + '  : response ', data);
    }
}

export async function getMessages() {
    let messages = await getMessagesMain();

    var messageList = [];
    if (!messages) return messageList;

    //console.log(dataJson);

    //messages.forEach(async (message) => {
    for (let message of messages) {
        // Get user from the list, if not found get from Web API
        var users = UserList.filter((item) => item.id === message.user_id);
        let user =  users[0];
        if (!user) {// not found in Array list
            console.log('user Not found In List');
            user = await getUser(message.user_id);
        }
        //console.log(`2 message ${message.id} - MsgUserID ${message.user_id} / ${user.userNickName}`);
        messageList.push(getMessageFromJson(message, user.nickname));
    }

    console.log('message list done');
    return messageList;

};

function getMessageFromJson(message, user_nickName) {
    return new Message(message.id, message.timestamp,
        message.user_id, user_nickName, message.message)
}

// Save new message
export async function saveMessage(message) {
    // if (true) return;
    if (message.message.length === 0) return;

    let saveUser = await fetch('https://chat.humbapa.ch/api/messages', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: message.message,
            user_id: message.user_id
        })
    });

    let data = await saveUser;

    if (data.status === 200) {
        let dataJson = await data.json();
        console.log(`message added : `)
        return true;
    } else {
        console.log('Unable to add message: ')
        return false;
    }
}

// Get the list of messages sync
async function getMessagesMain() {

    let messageList = [];

    let getMessages = await fetch('https://chat.humbapa.ch/api/Messages', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });

    let data = await getMessages;

    // Success
    if (data.status === 200) {
        let jsondata = await data.json();
        return jsondata;
    } else {
        console.log('Unable to get message list  : response ', data);
        return null;
    }
}

// // Get the list of messages
// function getMessages_() {
//     fetch('https://chat.humbapa.ch/api/Messages')
//
//         .then(data => {
//             if (data.status === 200) {
//                 return data.json();
//             } else {
//                 console.log('Unable to get the messages list status : ', data.status())
//                 return;
//             }
//         })
//         .then(jsondata => {
//
//             for (let i = 0, ii = jsondata.length; i < ii; i++) {
//                 messageList.push(new Message(jsondata[i].id, jsondata[i].timestamp,
//                     jsondata[i].user_id, '', jsondata[i].message))
//             }
//             return messageList;
//
//         });
// }

// get the message list sychrone (axios)
export function getMessagesAxios() {
    let messageList = [];
    axios.get('https://chat.humbapa.ch/api/Messages')
        .then((response) => {
            console.log('datas:', response);
            if (response.status === 200) {
                return response.data;
            } else {
                console.log('Unable to get the messages list status : ', response.status)
                return false;
            }
        })
        .then((jsondata) => {
            for (let i = 0, ii = jsondata.length; i < ii; i++) {
                // Get the user
                //let user = getUserSync(jsondata[i].user_id);
                // Add message object
                messageList.push(new Message(jsondata[i].id, jsondata[i].timestamp,
                    jsondata[i].user_id, '', jsondata[i].message))
            }
            console.log(messageList);
            return messageList;
        })

}

// -----------------------------
//  Message Class
// -----------------------------

export class Message {
    constructor(id, timestamp, user_id, userNickName, message) {
        this.id = id;
        this.timestamp = timestamp;
        this.user_id = user_id;
        this.userNickName = userNickName;
        this.message = message;
    }

    get Id() {
        return this.id;
    }

    get Timestamp() {
        return this.timestamp;
    }

    get User_id() {
        return this.user_id;
    }

    get UserNickName() {
        return this.userNickName;
    }

    get Message() {
        return this.message;
    }

}