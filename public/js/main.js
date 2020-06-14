const socket = io();

const createRoomDiv = document.getElementById('createRoom');
const showRoomCode = document.getElementById('showRoomCode');

// document.getElementById("code").style.display = 'none';
document.getElementById("submitBtn").style.display = 'none';

const createForm = document.getElementById('create-form');
// const chatMessages = document.querySelector('.chat-messages');


createForm.addEventListener('submit', (e) => {
    // e.preventDefault();
    var val = Math.floor(1000 + Math.random() * 9000);
    console.log(val);
    document.getElementById("roomcode").innerHTML = val;
})

function generateRoomCode() {
    var val = Math.floor(1000 + Math.random() * 9000);
    
    document.getElementById("code").value = val;

    // document.getElementById("code").style.display = 'block';
    document.getElementById("generateBtn").style.display = 'none';
    document.getElementById("submitBtn").style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function() {
    // nav menu
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'left'});
    
  });