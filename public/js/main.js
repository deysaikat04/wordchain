const socket = io();

const createRoomDiv = document.getElementById('createRoom');
const showRoomCode = document.getElementById('showRoomCode');


// document.getElementById("code").style.display = 'none';
document.getElementById("submitBtn").style.display = 'none';

const createForm = document.getElementById('create-form');
// const chatMessages = document.querySelector('.chat-messages');


// createForm.addEventListener('submit', (e) => {
//     // e.preventDefault();
//     if (document.getElementById('username').value === '') {
//         document.getElementById('error').innerText = "Please enter any username!";
//     } else {
//         var val = Math.floor(1000 + Math.random() * 9000);
//         document.getElementById("roomcode").innerText = val;

//         document.getElementById('error').innerText = "";
//     }
// });

function generateRoomCode() {

    if (document.getElementById('username').value === '') {
        document.getElementById('error').innerText = "Please enter any username!";
    } else {
        document.getElementById('error').innerText = "";
    }

    var val = Math.floor(1000 + Math.random() * 9000);

    document.getElementById("code").value = val;

    // document.getElementById("code").style.display = 'block';
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

    // socket.on('roomUsers', ({ room, users }) => {

    //     console.log(users, room);
    //     // callTimer(users);


    // });
}
