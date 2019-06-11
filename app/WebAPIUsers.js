// -----------------------------
// Functions
// -----------------------------

export const User_status = [
    {status: 'online', color: 'green'},
    {status: 'offline', color: 'grey'},
    {status: 'away', color: 'orange'}
]


// Check user exists
export async function checkUserExists(nickname) {
   let users = await getUserListMain();
    for (let i = 0, ii = users.length; i < ii; i++) {
        if (users[i].nickname == nickname) {
            console.log('checkUserExists, User found:', users[i].nickname);
            return true;
        }
    };
    return false;


    // await checkUserExistsMain(nickName)
    //     .then(exists => {
    //         console.log('exists', exists);
    //         return exists;
    //     }).catch(error => {
    //         console.error('Error check user exists:', error);
    //         return false;
    //     });

}

// // Get User from ID
// export async function getUser(user_id) {
//
//     await getUserSyncMain(user_id)
//         .then(user => {
//             console.log('get user: ', user);
//             return user;
//         }).catch(error => {
//             console.error(`Error get user (id=${user_id}) : ` , error);
//             return false;
//         });
// };

// Get user From Nickname
export async function getUserFromNickName(nickname) {

    let users = await getUserListMain();
    if (!users) return null;
    //console.log(dataJson);
    for (let i = 0, ii = users.length; i < ii; i++) {
            // Only one user
            if (nickname == users[i].nickname) {
                console.log('getUserList: User found:', users[i].nickname);
                return getUserFromJson(users[i]);
            }
    }
    return null;



    // Get User from DB and save the name / id on the local storage
    // await getUserListMain(nickname)
    //     .then(user => {
    //         if (user.length > 0)
    //         {
    //             return user[0];
    //         }
    //     }).catch(error => {
    //         console.error(`Error get user with (${nickname}) : ` , error);
    //     });
}

export async function getUserList() {

    let users = await getUserListMain();

    var userList = [];
    if (!users) return userList;

    //console.log(dataJson);
    for (let i = 0, ii = users.length; i < ii; i++) {
            userList.push(getUserFromJson(users[i]));
    }
    return userList;


    // await getUserListMain()
    //     .then(users => {
    //         console.log('getUsersList: ', users);
    //         return users;
    //     }).catch(error => {
    //         console.error('Error get user list: ' , error);
    //         return false;
    //     });
};



// export async function SaveUser(nickname) {
//
//     await SaveUserMain(nickname)
//         .then(function (id) {
//             console.log(`user ${nickname} saved id : `, id);
//             return id;
//         }).catch(error => {
//             console.error(`error save user ${nickname} web API:`, error);
//         });
// };




// async function checkUserExistsMain(value) {
//
//     let getUsers = await fetch('https://chat.humbapa.ch/api/users');
//     let data = await getUsers;
//     // Success
//     if (data.status === 200) {
//         let dataJson = await data.json();
//         return dataJson;
//     } else {
//         console.log('Unable to get the users list, status:', data.status);
//         return false;
//     }
//
//     return false;
// }



// Get the user list (only one or all the users)
export async function getUserListMain(userNickName) {

    let getUsers = await fetch('https://chat.humbapa.ch/api/users');
    let data = await getUsers;

    // Success
    if (data.status === 200) {
        let dataJson = await data.json();
        return dataJson;
    } else {
        console.log('Unable to get the users list, status:', data.status);
        return null;
    }

}

// function getUser_(user_id) {
//     fetch('https://chat.humbapa.ch/api/users/' + user_id, {
//         method: 'GET',
//         headers: {'Content-Type': 'application/json'}
//
//     })
//         .then(response => {
//             if (response.status === 200) {
//                 return getUserFromJson(response.json());
//             } else {
//                 console.log('Unable to get ' + user_id + '  : response ', response);
//             }
//         })
//
// }

export async function getUser(user_id) {

    let getUser = await fetch('https://chat.humbapa.ch/api/users/' + user_id, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });

    let data = await getUser;

    // Success
    if (data.status === 200) {
        let dataJson = await data.json();
        return getUserFromJson(dataJson);
    } else {
        console.log('Unable to get user ' + user_id + '  : response ', data);
    }
}


//console.log('userID ' + i,messageList[i].user_id )

// export async function getUserSync(user_id) {
//     axios.get('https://chat.humbapa.ch/api/users/' + user_id)
//      .then((response) => {
//             console.log('datas:', response);
//             if (response.status === 200) {
//                 return response.data;
//             } else {
//                 console.log(`Unable to get the user with id ${user_id} - status : `, response.status)
//                 return false;
//             }
//         })
//         .then((jsondata) => {
//             return getUserFromJson(jsondata);
//         });
// }


export function getUserFromJson(data) {
    return new Users(data.id, data.nickname, data.created, data.updated, data.last_status_change,
        data.status, data.avatar, data.description);

}

// Save the user nickName into the DB
export async function saveUser(nickname) {
   // if (true) return;
    if (nickname.length === 0) return;

    let saveUser = await fetch('https://chat.humbapa.ch/api/users', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nickname: nickname,
            // created: Date.now(),
            // updated: Date.now(),
            // last_status_change: Date.now(),
            // avatar: '',
            // status: 'offline',
            // description: '-',
        })
    });

    let data = await saveUser;

    if (data.status === 200) {
        let dataJson = await data.json();
        console.log(`User with name ${nickname}  added : `, dataJson)
        return new Users(dataJson.id, nickname); // return the ID
    } else {
        console.log('Unable to add ' + nickname + ' response: ', data)
        return null;
    }
}

// Save the user nickName into the DB
export async function updateUser(user) {

    let updateUser = await fetch('https://chat.humbapa.ch/api/users', {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id : user.id,
            nickname: user.nickname,
            avatar: user.avatar,
            status: user.status,
            description: user.description,
        })
    });

    let data = await updateUser;

    if (data.status === 200) {
        let dataJson = await data.json();
        console.log(`User with name ${user.nickname}  updated : `, dataJson)
        return true;
    } else {
        console.log('Unable to update ' + user.nickname + ' response: ', data)
        return false;
    }
}


// Remove users
export function removeUser(user_id) {
    fetch('https://chat.humbapa.ch/api/users/' + user_id, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
        // body: JSON.stringify({id: user_id })
    })
        .then(response => {
            if (response.status === 200) {
                console.log('User with id ' + user_id + '  removed : ', response.json())
                //return response.json();
            } else {
                console.log('Unable to remove ' + user_id + '  response : ', response)
            }
        })
}

// Remove users
export async function removeUserSync(user_id) {
    let removeUser = await fetch('https://chat.humbapa.ch/api/users/' + user_id, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
        // body: JSON.stringify({id: user_id })
    });

    let data = await removeUser;

    if (removeUser.status === 200) {
        let dataJson = await data.json();
        console.log('User with id ' + user_id + '  removed : ', dataJson)
        //return response.json();
    } else {
        console.log('Unable to remove ' + user_id + '  removed')
    }
}


// -----------------------------
// Users Classes
// -----------------------------

export class Users {
    constructor(id, nickname, created, updated, last_status_change, status, avatar, description) {
        this.id = id;
        this.nickname = nickname;
        this.created = created;
        this.updated = updated;
        this.last_status_change = last_status_change;
        this.status = status;
        this.avatar = avatar;
        this.description = description;
    }

    get Id() {
        return this.id;
    }

    set Id(val) {
        this.id = val;
    }

    get Nickname() {
        return this.nickname;
    }

    get Created() {
        return this.created;
    }

    get Updated() {
        return this.updated;
    }

    get Last_status_change() {
        return this.last_status_change;
    }

    get Status() {
        return this.status;
    }

    get Avatar() {
        return this.avatar;
    }

    get Description() {
        return this.description;
    }
}

