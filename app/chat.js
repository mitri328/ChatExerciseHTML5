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
import {sendNotification} from "./Notifications.js";

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

    .then(user => {
         setUserToLocalStorage(user);
         // Update user (set online)
        if (!LoggedUser.status === 'online')
            return updateUser(user);
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
    var divNode;


    if (action == Ws_event.user_added) {
        // create user node
        divNode = document.createElement("div");
        divNode.setAttribute('id', item.id);
        divNode.setAttribute('draggable', 'true');
    } else {
        // Get existing user node
        divNode = document.getElementById(item.id)
    }

    if (!divNode) {return;}

    // update : remove the nodes, and add new ones
    if (action == Ws_event.user_updated) {
        while (divNode.firstChild) {
            divNode.removeChild(divNode.firstChild);
        }
    }

    if (action != Ws_event.user_deleted) {

        // Add drop target container
        var dragTargetNode = document.createElement("div");
        dragTargetNode.setAttribute('class', 'site-users-dragTargetContainer');

        // Create User data Ul container
        var ulNode = document.createElement("ul");


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
        context.arc(6, 6, 6, 0, Math.PI * 2, false);
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

        // Add dragTargetNode before
        divNode.appendChild(dragTargetNode);
        addDropTragetContainerEvent(dragTargetNode); // Event

        // Add User data
        divNode.appendChild(ulNode);
        addUserDragStartEvent(divNode); // Event

    }

    var userListNode = document.getElementById("users");

    // -- Append / Remove child - up to action
    if (action === Ws_event.user_added) {
        // Add at the beggining of the list
        userListNode.insertBefore(divNode, userListNode.children[0]);
    } else if (action === Ws_event.user_deleted) {
        // Remove the user
        userListNode.removeChild(divNode);
    }
}

// Add User Element Drag&Drop Start Event
function addUserDragStartEvent(userNode) {

        userNode.addEventListener('dragstart', (e) => {
            console.log('dragstart');
            var node = e.target;
            // Save source user
            e.dataTransfer.setData('SourceUserId', node.id);
        })

}
// Add the drop target container Event
function addDropTragetContainerEvent(targetContainer) {
    //if (action == Ws_event.user_added) {

        targetContainer.addEventListener("dragover", (e) => {
            e.preventDefault();
            console.log('dragover');
        })
        targetContainer.addEventListener("dragenter", (e) => {
            e.preventDefault();
            console.log('dragenter');
        })

        targetContainer.addEventListener("drop", (e) => {

            // Get User/Parents DOM Elements
            var id = e.dataTransfer.getData('SourceUserId');
            var sourceUserNode = document.getElementById(id);
            var targetUserNode = e.target.parentElement;
            var ParentNode = sourceUserNode.parentElement;

            // Move Node User after the drag target element
            users.removeChild(sourceUserNode);
            users.insertBefore(sourceUserNode, targetUserNode); //attempt to insert it

            // Log
            console.log('SourceUserNode', sourceUserNode);
            console.log('TargetUserNode', targetUserNode);
            console.log('ParentNode', ParentNode);
        })
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
var chatWSocket = new WebSocket("wss://chat.humbapa.ch/ws");
chatWSocket.onerror = function (event) {
    console.log("WebSocket Error:")
    console.log(event);
}
chatWSocket.onmessage = async function (event) {
    console.log("Neue WebSocket Message:")
    console.log(event.data);

    var data = JSON.parse(event.data)

    switch (data.action) {
        case Ws_event.message_added: {
            let message = await getMessage(data.data.id);
            addMessageInDOM(message);
            if (message.user_id !== LoggedUser.id)
                sendNotification(`${message.userNickName} says: ${message.message}`);
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
chatWSocket.onopen = function (event) {
    // Sende eine Nachricht an den Server, der Server wird diese danach einfach an alle verbundenen Clients zurückschicken (Echo).
    //exampleSocket.send("Hello World");
}







