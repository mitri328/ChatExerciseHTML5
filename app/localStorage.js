import {getUserFromJson, getUserPersonalDataFromJson, Users, UserPersonalData} from "./WebAPIUsers.js";

/*
-------------------
Set/Get User Local storage
--------------------
 */

export let LoggedUser;
export let LoggedUserPersonalData;


// Save User datas to local storage
export function setUserToLocalStorage(user) {
    LoggedUser = user;
    // Save User in local storage
    localStorage.setItem('LoggedUser', JSON.stringify(user));
    console.log(`set user into localStorage ${user.nickname} / ${user.id}`);
}

// get user from local storage
export function getUserFromLocalStorage() {
    let data = JSON.parse(localStorage.getItem('LoggedUser'));
    if (!data)
        setUserToLocalStorage(new Users('', '')); // set a empty user object if doesn't exists
    else
        LoggedUser = getUserFromJson(data);
    console.log(`get user from localStorage ${LoggedUser.nickname} / ${LoggedUser.id}`);
}



// Save PersonalData to local storage
export function setPersonalDataToLocalStorage(userPersonalData) {
    LoggedUserPersonalData = userPersonalData;
    // Save User in local storage
    localStorage.setItem('LoggedUserPersonalData', JSON.stringify(userPersonalData));
    console.log('set userPersonalData on local storage: ', userPersonalData.firstname + '/' + userPersonalData.lastname);
}

// get PersonalData from local storage
export function getPersonalDataFromLocalStorage() {
    let data = JSON.parse(localStorage.getItem('LoggedUserPersonalData'));
    if (!data)
        setPersonalDataToLocalStorage(new UserPersonalData('', '', '', '', '', 'Switzerland', 1)); // set a empty user object if doesn't exists
    else
        LoggedUserPersonalData = getUserPersonalDataFromJson(data);
    console.log(`get user from localStorage ${LoggedUserPersonalData.firstname} / ${LoggedUserPersonalData.lastname}`);
}



