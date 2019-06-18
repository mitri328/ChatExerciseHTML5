import {
    getUserFromLocalStorage,
    setPersonalDataToLocalStorage,
    getPersonalDataFromLocalStorage,
    setUserToLocalStorage,
    LoggedUser,
    LoggedUserPersonalData
} from "./localStorage.js";
import {updateUser} from "./WebAPIUsers.js";

console.log('Script profile');

// get datas from local storage
getUserFromLocalStorage();
getPersonalDataFromLocalStorage();
console.log(`localStorage ${LoggedUser.nickname} / ${LoggedUser.id} / ${LoggedUserPersonalData.lastname}`);

// if no user logged the return to login page
if (!LoggedUser.nickname || LoggedUser.nickname == '') window.open('index.html', '_self');


const form = document.querySelector('form');


// Save user

form.addEventListener('submit', () => {


    LoggedUserPersonalData.firstname = firstname.value;
    LoggedUserPersonalData.lastname = lastname.value;
    LoggedUserPersonalData.email = email.value;
    LoggedUserPersonalData.zipcode = zipcode.value;
    LoggedUserPersonalData.city = city.value;
    LoggedUserPersonalData.country = country.value;

    LoggedUserPersonalData.backgroundimage = $("input[name='backgroundimage']:checked").val();

    LoggedUser.nickname = nickname.value;
    LoggedUser.avatar = $("input[name='profilepicture']:checked").val();
    LoggedUser.description = description.value;

    // save to local storage
    setPersonalDataToLocalStorage(LoggedUserPersonalData);
    setUserToLocalStorage(LoggedUser);


})

// Personal Datas
let firstname = document.querySelector('#firstname');
firstname.value = LoggedUserPersonalData.firstname;
let lastname = document.querySelector('#lastname');
lastname.value = LoggedUserPersonalData.lastname;
let email = document.querySelector('#email');
email.value = LoggedUserPersonalData.email;
let zipcode = document.querySelector('#zipcode');
zipcode.value = LoggedUserPersonalData.zipcode;
let city = document.querySelector('#city');
city.value = LoggedUserPersonalData.city;
let country = document.querySelector('#country');
country.value = LoggedUserPersonalData.country;

let backgroundimage = document.getElementsByName('backgroundimage');
if (LoggedUserPersonalData.backgroundimage)
    backgroundimage[LoggedUserPersonalData.backgroundimage - 1].checked = true;

let nickname = document.querySelector('#nickname');
nickname.value = LoggedUser.nickname;
let profilepicture = document.getElementsByName('profilepicture');
if (LoggedUser.avatar)
    profilepicture[LoggedUser.avatar - 1].checked = true;
let description = document.querySelector('#profiledescription');
description.value = LoggedUser.description;

// Update user Web API
let success = updateUser(LoggedUser);







