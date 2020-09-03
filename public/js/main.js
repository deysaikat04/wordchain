const socket = io();

const createRoomDiv = document.getElementById('createRoom');
const showRoomCode = document.getElementById('showRoomCode');

document.getElementById("createBtn").style.display = 'none';

const createForm = document.getElementById('create-form');


function generateRoomCode() {

    validateGameTimer();
    validateUsername();

    var val = Math.floor(1000 + Math.random() * 9000);

    document.getElementById("code").value = val;

    document.getElementById("generateBtn").style.display = 'none';
    document.getElementById("createBtn").style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function () {
    // nav menu
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, { edge: 'left' });

});

function validateGameTimer() {
    let gameTimer = document.getElementById('gameTimer').value;

    if (gameTimer === '') {
        document.getElementById('error-timer').innerText = "Please enter the time!";
        document.getElementById("btnCreate").disabled = true;
    } else {
        document.getElementById('error-timer').innerText = "";
        document.getElementById("btnCreate").disabled = false;
    }
}

function validateUsername() {

    if (document.getElementById('username').value === '') {
        document.getElementById('error').innerText = "Please enter any username!";
        document.getElementById("btnCreate").disabled = true;
    } else {
        document.getElementById('error').innerText = "";
        document.getElementById("btnCreate").disabled = false;
    }
}

function validateUserAddRoom() {

    if (document.getElementById('usernameGo').value === '') {
        document.getElementById('error-usernameGo').innerText = "Please enter any username!";
        document.getElementById("btnGo").disabled = true;
    } else {
        document.getElementById('error-usernameGo').innerText = "";
        document.getElementById("btnGo").disabled = false;
    }
}

function checkIfRoomExists() {

    if (document.getElementById('roomGoCode').value === '') {
        document.getElementById('error-roomGo').innerText = "Please enter valid room code!";
        document.getElementById("btnGo").disabled = true;
    } else {
        document.getElementById('error-roomGo').innerText = "";
        document.getElementById("btnGo").disabled = false;
    }
}

function check() {
    if (document.getElementById('usernameGo').value === '' || document.getElementById('roomGoCode').value === '') {
        document.getElementById("btnGo").disabled = true;
    } else {
        document.getElementById("btnGo").disabled = false;
    }
}

function copyCode() {
    var copyText = document.getElementById("code");

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");

    /* Alert the copied text */
    console.log(copyText.value);
}