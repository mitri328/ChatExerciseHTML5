import {removeUser, removeUserSync, checkUserExists, getUserList, Users} from "./WebAPIUsers.js";


const value = document.querySelector('#name'); // document.querySelector('input')
const button = document.querySelector('#btn'); // document.querySelector('input')


button.addEventListener('click', async () => {
    let deleted = await removeUserSync(value.value);
    //exampleSocket.send("Hello World 2");
})



// var exampleSocket = new WebSocket("wss://chat.humbapa.ch/ws");
// exampleSocket.onerror = function (event) {
//     console.log("WebSocket Error:")
//     console.log(event);
// }
// exampleSocket.onmessage = function (event) {
//     console.log("Neue WebSocket Message:")
//     console.log(event.data);
// }
// exampleSocket.onopen = function (event) {
//     // Sende eine Nachricht an den Server, der Server wird diese danach einfach an alle verbundenen Clients zurückschicken (Echo).
//     exampleSocket.send("Hello World");
// }
//
// function reqListener () {
//     console.log(this.responseText);
// }
//
// var oReq = new XMLHttpRequest();
// oReq.addEventListener("load", reqListener);
// oReq.open("GET", "https://chat.humbapa.ch/api/Messages");
// oReq.send();

// //getMessagesSync();
//
// let getUsers = async function () {
//     let response = await fetch('https://chat.humbapa.ch/api/Users')
//     let data = await response.json()
//     return data
// }
//
// let main = async function () {
//
//
//     let users = await getUsers()
//
//     //let outputElement = document.querySelector('pre')
//     for (let i = 0, ii = users.length; i < ii; i++) {
//         //console.log(users[i].nickname);
//     }
// }();


// var exists = checkUserExists('dimggg');
//
// let fct = async function () {
//
//     await checkUserExists('dimggg')
//         .then(value => {
//             console.log('exists', value);
//             return getUserList();
//
//         })
//         .then(result => {
//
//             console.log('users', result);
//         })
// //console.log('exists', exists);
// };
//
// function exec() {
//     return null;
// }
// console.log((exec() == true));

// const persons = [
//     {name:'Dim', num : 24, message:'Hello'},
//     {name:'toto', num : 45, message:'Hi'}
// ];
//
//
// //
// persons.forEach(async ({name, num}) => {
//     let promise = await timeout(name, num, 1000, 1);
// });
// console.log('done 1');
// // pas sychronisé: Ordre done/object1/2
//
// for (let item of persons) {
//     let promise =  timeout(item.name, item.num, 1000, 2);
// }
// console.log('done 2');
//
// let fct = async function() {
//     for (let item of persons) {
//         let promise =  await timeout(item.name, item.num, 1000, 3);
//     }
//     console.log('done 3');
// }();
// // pas sychronisé: Ordre done/object1/2
//
// function timeout(name, num, ms, test) {
//     return new Promise(resolve => setTimeout(async () => {
//         console.log(test, name, num);
//     }, ms));
// }
// sychronisé: Ordre /object1/2/done


// function myFunction() {
//     setTimeout(alertFunc, 3000);
// }
// myFunction();


//
// checkUserExists('dim')
//     .then(value => {
//         console.log('exists 1', value);
//         return getUserList();
//
//     })
//     .then(result => {
//
//         console.log('users 1', result);
//     })