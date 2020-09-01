const socket = io();

const createRoomDiv = document.getElementById('createRoom');
const showRoomCode = document.getElementById('showRoomCode');

document.getElementById("submitBtn").style.display = 'none';

const createForm = document.getElementById('create-form');


function generateRoomCode() {

    if (document.getElementById('username').value === '') {
        document.getElementById('error').innerText = "Please enter any username!";
    } else {
        document.getElementById('error').innerText = "";
    }

    var val = Math.floor(1000 + Math.random() * 9000);

    document.getElementById("code").value = val;

    document.getElementById("generateBtn").style.display = 'none';
    document.getElementById("submitBtn").style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function () {
    // nav menu
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, { edge: 'left' });

});

function validateUsername() {
    if (document.getElementById('username').value === '') {
        document.getElementById('error').innerText = "Please enter any username!";
        document.getElementById("btnCreate").disabled = true;
    } else {
        document.getElementById('error').innerText = "";
        document.getElementById("btnCreate").disabled = false;
    }
}

function checkIfRoomExists() {
    console.log("hola");
}
