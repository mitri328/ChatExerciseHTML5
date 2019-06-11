import {Users} from "./WebAPIUsers.js";
import {setUserToLocalStorage, getUserFromLocalStorage, LoggedUser} from "./localStorage.js";


console.log('login script...')

// DOM Elements
const nicknameInput = document.querySelector('#nickname'); // document.querySelector('input')
const saveButton = document.querySelector('#saveButton'); // document.querySelector('input')
const form = document.querySelector('form');

//saveButton.style.visibility = 'hidden'; // hide save button (only for my tests)


/*
---------------------------
Validation user Nick Name
---------------------------
*/

nicknameInput.addEventListener('input', () => { // change / keypress / input:
    nicknameInput.setCustomValidity('');
    console.log('keypress!');
});


nicknameInput.addEventListener('invalid', () => {
    if (nicknameInput.value === '') {
        nicknameInput.setCustomValidity('Enter your nickname!');
        console.log('nickname missing');
    } else {
        nicknameInput.setCustomValidity('nickname format not valid!');
        console.log('nickname invalid');
    }
});


/*
---------------------------
Local Storage
---------------------------
*/

// retrieve nickName form local storage
getUserFromLocalStorage();
nicknameInput.value = LoggedUser.nickname;
console.log(`localStorage ${LoggedUser.nickname} / ${LoggedUser.id}`);


/*
---------------------------
Submit form
---------------------------
*/


form.addEventListener('submit', () => { // change
    nicknameInput.setCustomValidity('');
    nicknameInput.checkValidity(); //nicknameInput.reportValidity() ;// firstNameInput.checkValidity();

    // Save User in local storage
    setUserToLocalStorage(new Users('', nicknameInput.value));
    console.log('submit:');

});

/*
---------------------------
Test save button
---------------------------
*/
saveButton.addEventListener('click', () => {
    // Save User in local storage
    setUserToLocalStorage(new Users('', nicknameInput.value));
    console.log('save click!');

})