const socket = io();


var count = 9;
var t;
var timer_is_on = 0;
// const createForm = document.getElementById('create-form');
// // const chatMessages = document.querySelector('.chat-messages');

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const userList = document.getElementById('side-menu');

var currUser;

// Get username and room
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

//Join chatroom
socket.emit('joinRoom', { username, room });

socket.on('message', message => {    
    outputMessage(message);    
    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('roomUsers', ({ room, users }) => {

    console.log(users.length);
    callTimer(users);
    
    userList.innerHTML = `
        <li><a class="subheader">WORDCHAIN</a></li> 
        ${users.map(user => `
            <li>                
            <a href="" class="waves-effect">
            <i class="material-icons">account_circle</i>
            ${user.username}</a>
            </li>
        `).join('')}
        <li><div class="divider"></div></li>
        <li><a href="" class="waves-effect">
        <i class="material-icons">mail_outline</i>Contact</a>
        </li>

        <li><div class="divider"></div></li>
        <li><a href="index.html" class="waves-effect">
        <i class="material-icons">cancel</i>Leave</a>
        </li>
      `;
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // stopCount();
    //get msg
    const msg = e.target.elements.msg.value;
    
    //Emit a message to server
    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.blur();
    e.target.elements.msg.disabled = false;
});

//output message to DOM
function outputMessage(message) {
    
    const div = document.createElement('div');
    
    if(message.username === username) {

        div.classList.add('message');
        div.innerHTML = 
        `
            <div>   
                <p class="meta">${message.username} <span>${message.time}</span></p>
                <p class="chat-text">
                    ${message.text}
                </p>
            </div>
        `;

    }
    else {
        div.classList.add('message-sender');
        div.innerHTML = 
        `
            <div>              
                <p class="meta-sender">${message.username} <span>${message.time}</span></p>
                <span class="chat-text-sender">
                    ${message.text}
                </p>
            </div>
        `;
    }       

    document.querySelector('.chat-messages').appendChild(div);
    var seperator = document.createElement('br');
    document.querySelector('.chat-messages').appendChild(seperator);
}



document.addEventListener('DOMContentLoaded', function() {
    // nav menu
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'left'});
    
  });

function timer() {
    var countDown = 9;
    var pulse = 0;
    
    var x = setInterval(function() {

        var distance = countDown - pulse;    
        pulse += 1;
        document.getElementById("timer").innerHTML = '0' + distance;
        if (distance < 0) {
          clearInterval(x);
          document.getElementById('msg').disabled = true;
          document.getElementById('msg').value = "SORRY!! TIME OUT!!";
          document.getElementById("timer").innerHTML = "00";
          socket.emit('chatMessage', `${username} - Timeout!!`);
        }
      }, 1000);    
}

function callTimer(users) {
    sec = (users.length - 1) * 10;
    console.log("sec", sec);
    
    // startCount(sec);
}

function timedCount(sec) {
    document.getElementById("timer").innerText = '0' + count;
    // count = count - 1;
    // console.log(count);    
    t = setTimeout(timedCount, 1000);
    if( count < 0 ) {
        clearTimeout(t);
        document.getElementById('msg').disabled = true;
        document.getElementById('msg').value = "SORRY!! TIME OUT!!";
        setInterval(function() {
            stopCount();
            startCount(sec)
        }, sec);
    }
}

function startCount(sec) {
  if (!timer_is_on) {
    timer_is_on = 1;
    timedCount(sec);
  }
}

function stopCount() {
  clearTimeout(t);
  timer_is_on = 0;
  count = 9;
}