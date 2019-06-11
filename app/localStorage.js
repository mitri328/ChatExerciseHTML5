import {getUserFromJson, Users} from "./WebAPIUsers.js";

/*
-------------------
Set/Get User Local storage
--------------------
 */

export let LoggedUser;



// Save User datas to local storage
export function SetUserToLocalStorage(user) {
    LoggedUser = user;
    // Save User in local storage
    localStorage.setItem('LoggedUser', JSON.stringify(user));
    console.log('set user on local storage: ', user.nickname + '/' + user.id);
}

// get user from local storage
export function GetUserFromLocalStorage() {
    let data = JSON.parse(localStorage.getItem('LoggedUser'));
    if (!data)
        SetUserToLocalStorage(new Users('', '')); // set a empty user object if doesn't exists
    else
        LoggedUser = getUserFromJson(data);
    console.log(`get user from localStorage ${LoggedUser.nickname} / ${LoggedUser.id}`);
}

