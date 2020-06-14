const socket = io();

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
    
    
    // if(currUser === username) div.classList.add('message-sender');
    // div.classList.add('message');
    // userList.innerHTML = 
    //     `${users.map(user => {
    //         `   <li>                
    //                 <a href="" class="waves-effect">
    //                     <i class="material-icons">account_circle</i>
    //                     ${user.username}
    //                 </a>
    //             </li>
    //         `;            
    //     }).join('')}`;
    
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

    //get msg
    const msg = e.target.elements.msg.value;
    
    //Emit a message to server
    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    
    // if(currUser === username) div.classList.add('message-sender');
    div.classList.add('message');

    div.innerHTML = 
    `
        <div class="text-right">
            <p class="text">
                ${message.text}
            </p>
            <p class="meta">${message.username} <span>${message.time}</span></p>
        </div>
    `;
    document.querySelector('.chat-messages').appendChild(div);
}



document.addEventListener('DOMContentLoaded', function() {
    // nav menu
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'left'});
    
  });