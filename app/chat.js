import {
    getUserList,
    getUser,
    getUserFromNickName,
    checkUserExists,
    saveUser,
    updateUser,
    Users,
    User_status
} from "./WebAPIUsers.js";
import {getMessages, getMessage, saveMessage, Message} from "./WebAPIMessages.js";
import {getUserFromLocalStorage, setUserToLocalStorage, LoggedUser} from "./localStorage.js";
import {ConvertDate} from "./common.js";
import {Ws_event} from "./WebScocket.js";


console.log('chat script...')

// DOM

// Test message ID TODO Remove
// const input = document.querySelector('#name');
// const button = document.querySelector('#btn');
// button.addEventListener('click', async () => {
//
//     var user = LoggedUser;
//     user.avatar = 2
//     user.status = 'offline'
//     console.log(user);
//     let ok = await updateUser(user);
//
//     //let message = await getMessage(input.value);
//     //addMessageInDOM(message);
// })

// --------------------
// DOM send Message Button
// --------------------
const sendMessage = document.querySelector('#sendMessage');
const sendButton = document.querySelector('#sendButton');

// Send message
sendButton.addEventListener('click', () => {
    let message = new Message('', '', LoggedUser.id, '', sendMessage.value);
    saveMessage(message);
    sendMessage.value = '';
})

// --------------------
// retrieve nickName form local storage
// --------------------
getUserFromLocalStorage();
console.log(`localStorage ${LoggedUser.nickname} / ${LoggedUser.id}`);
// if no user logged the return to login page
if (!LoggedUser.nickname || LoggedUser.nickname == '') window.open('index.html', '_self');

// Update user Web API
let success =  updateUser(LoggedUser);

// --------------------
// Save the new login nickname or load from DB if exists
// --------------------


checkUserExists(LoggedUser.nickname)
    .then(exist => {
        if (exist)
            return getUserFromNickName(LoggedUser.nickname);
        else
            return saveUser(LoggedUser.nickname);
    })
    // TODO Update User : Status = Online
    .then(user => {
        return setUserToLocalStorage(user);
    })
    .then(() => {

        // --------------------
        // get the user list
        // --------------------
        return getUserList();

    })
    .then((userList) => {
        console.log('userList', userList);

        userList
        //.filter((item) => item.status === 'online' || item.status === 'offline')
            .forEach((item) => {
                updateUserInDOM(item, Ws_event.user_added);
            });
    })
    .then(async (messageList) => {
        // --------------------
        // get the messages list
        // --------------------
        let messages = await getMessages();
        return messages;

    })

    .then((messageList) => {
        // --------------------
        // get the messages list
        // --------------------

        messageList.reverse();

        console.log('mesageList', messageList);

        // Add in DOM
        messageList.forEach((message) => {
            addMessageInDOM(message);
        });


    }).catch(error => {
    console.error(`Error get user/mesages for chat : `, error);
});


console.log('continue');


// --------------------
// add users in DOM
// --------------------


/*
addUserInDOM
action are
updated/added/deleted

*/
function updateUserInDOM(item, action) {
    var ulNode;


    if (action == Ws_event.user_added) {
        // create user node
        ulNode = document.createElement("ul");
        ulNode.setAttribute('id', item.id);
    } else {
        // Get existing user node
        ulNode = document.getElementById(item.id)
    }

    if (!ulNode) {
        return;
    }

    // update : remove the nodes, and add new ones
    if (action == Ws_event.user_updated) {
        while (ulNode.firstChild) {
            ulNode.removeChild(ulNode.firstChild);
        }
    }

    if (action != Ws_event.user_deleted) {

        // Avatar
        var liAvatar = document.createElement("li");
        var img = document.createElement("img");
        img.src = `images/avatar_icon_${item.avatar}.svg`;
        liAvatar.appendChild(img);
        ulNode.appendChild(liAvatar);


        // status
        var canvas = document.createElement("canvas");
        canvas.setAttribute('width', '16px');
        canvas.setAttribute('height', '16px');
        var context = canvas.getContext("2d");
        context.arc(8, 8, 8, 0, Math.PI * 2, false);
        var color = User_status.filter(v => v.status === item.status);
        context.fillStyle = color[0].color;
        context.fill()

        var liStatus = document.createElement("li");
        liStatus.appendChild(canvas);
        ulNode.appendChild(liStatus);

        // Nickname
        var liNickname = document.createElement("li");
        liNickname.appendChild(document.createTextNode(item.nickname));
        ulNode.appendChild(liNickname);
    }

    // -- Append / Remove child - up to action
    if (action === Ws_event.user_added) {

        document.getElementById("users").appendChild(ulNode);
    } else if (action === Ws_event.user_deleted) {
        document.getElementById("users").removeChild(ulNode);
    }
}


// --------------------
// add messages in DOM
// --------------------

function addMessageInDOM(message) {
    var ulNode = document.createElement("ul");
    if (LoggedUser.id === message.user_id)
        ulNode.setAttribute('class', 'messageOutbox');
    else
        ulNode.setAttribute('class', 'messageInbox');
    // Add user
    //console.log(Timestamp);
    let date = ConvertDate(message.timestamp);
    var liUser = document.createElement("li");
    liUser.setAttribute('class', 'messageHeader');
    liUser.appendChild(document.createTextNode(`${message.userNickName} - ${date}`));
    ulNode.appendChild(liUser);
    // add message
    var liMessage = document.createElement("li");
    liMessage.appendChild(document.createTextNode(message.message));
    ulNode.appendChild(liMessage);
    //
    document.getElementById("messages").appendChild(ulNode);
    // Scroll
    var mesgEle = document.getElementById('messages');
    mesgEle.scrollTop = mesgEle.scrollHeight;
}

// ------------------------------------
// Web Socket
// ------------------------------------
var exampleSocket = new WebSocket("wss://chat.humbapa.ch/ws");
exampleSocket.onerror = function (event) {
    console.log("WebSocket Error:")
    console.log(event);
}
exampleSocket.onmessage = async function (event) {
    console.log("Neue WebSocket Message:")
    console.log(event.data);
    var data = JSON.parse(event.data)

    switch (data.action) {
        case Ws_event.message_added: {
            let message = await getMessage(data.data.id);
            addMessageInDOM(message);
            console.log("Case message_added");
            break;
        }
        case Ws_event.user_added: {
            if (data.data.nickname !== LoggedUser.nickname) // dont add if it is the own  User (otherwise will be twice added)
            {
                let user = await getUser(data.data.id)
                updateUserInDOM(user, Ws_event.user_added);

                console.log("Case user_added");
                break;
            }
        }
        case Ws_event.user_updated: {
            let user = await getUser(data.data.id)
            updateUserInDOM(user, Ws_event.user_updated);
            console.log("Case user_updated");
            break;
        }
        case Ws_event.user_deleted: {
            //let user = await getUser(data.data.id)
            updateUserInDOM(new Users(data.data.id), Ws_event.user_deleted);
            console.log("Case user_deleted");
            break;
        }
        default: {
            console.log("Case default");
        }
    }


}
exampleSocket.onopen = function (event) {
    // Sende eine Nachricht an den Server, der Server wird diese danach einfach an alle verbundenen Clients zurückschicken (Echo).
    //exampleSocket.send("Hello World");
}

// function reqListener () {
//     console.log('HttpRequest', this.responseText);
// }
//
// var oReq = new XMLHttpRequest();
// oReq.addEventListener("load", reqListener);
// oReq.open("GET", "https://chat.humbapa.ch/api/Messages");
// oReq.send();


// Get the user list (only one or all the users)
// function getMessages_1() {
//
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
//
//             }
//         }).catch(error => {
//         console.error('error get message list:', error);
//     });
//
//
// }


// -----------------------
// Load/save test messages into/from local storage (TO REMOVE)
// -----------------------
// localStorage.setItem('test', '');
//
// function myFunction() {
//     var val = document.getElementById("myMessage").value;
//
//     // get the item from localStorage
//     var newItem = localStorage.getItem('test') + '<p class="messageOutbox">' + val + '</p>'
//
//     // set the item in localStorage
//     localStorage.setItem('test', newItem);
//
//     document.getElementById("displayMessage").style.visibility = "visible";
//
//     document.getElementById("displayMessage").innerHTML = localStorage.getItem('test');
//
//     var objDiv = document.getElementById('messages');
//     objDiv.scrollTop = objDiv.scrollHeight;
// }



