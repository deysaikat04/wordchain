const socket = io();

var wordArr = [];
var currUser = '';
var count = 9;
var t;
var timer_is_on = 0;

var user_turn = false;
var userArr = [];
// const createForm = document.getElementById('create-form');
// // const chatMessages = document.querySelector('.chat-messages');

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const userList = document.getElementById('side-menu');

var userCount = 0;

// Get username and room
const { username, room, token } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Set the start button who creates the room
function setStart(){
    if(token === "true") {        
        document.getElementById("startBtn").style.display = 'block';
    } else {
        document.getElementById("startBtn").style.display = 'none';
    }
}


//Join chatroom
socket.emit('joinRoom', { username, room });

//get the message
socket.on('message', message => { 
    wordArr = message.words;
    currUser = message.username;
    
    outputMessage(message);    
    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;   
    
    
});

socket.on('botMessage', message => { 
    currUser = message.username;
    const div = document.createElement('div');
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

    document.querySelector('.chat-messages').appendChild(div);
    var seperator = document.createElement('br');
    document.querySelector('.chat-messages').appendChild(seperator);

    chatMessages.scrollTop = chatMessages.scrollHeight;   
    
    
});

socket.on('msgLetter', data => { 
    // if(data.username !== username) {
    //     document.getElementById('msg').value = data.msg;
    // }
});

//get the users and room details
socket.on('roomUsers', ({ room, users }) => {

    userArr = users;

    userArr.map((user) => {
        if(user.username === username) {
            user.turn = true;         
            
        } 
    });
    
    socket.emit("turn", userArr);
    
    // callTimer(users);
    userCount = users.length;

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

// chat form submit
chatForm.addEventListener('submit', (e) => {    

    e.preventDefault();

    // console.log(username, user_turn);
    
    const msg = e.target.elements.msg.value;
    
    //Emit a message to server
    socket.emit('chatMessage', msg);

    socket.emit('startLetter', msg.slice(-1).toUpperCase());

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
    // clearInterval(interval);
    // stopCount();    
    
});

// socket.on("userTurn", newUser => {
//     // userArr = newUser;
//     // console.log(newUser);
//     newUser.map((user) => {
//         if(user.username === username) {
//             user_turn = user.turn;
//         }        
//     });

//     userArr = newUser;
//     // callTimer(); 
// });

//output message to DOM
function outputMessage(message) {

    console.log(count);
    
    const div = document.createElement('div');
    
    if(message.username === username) {
       
        stopCount();
        
        div.classList.add('message');
        div.innerHTML = 
        `
            <div>   
                <p class="meta">${message.username} <span>${message.time}</span></p>
                <p class="chat-text">
                    ${message.text} <span class="time">${count}s</span>
                </p>
            </div>
        `;

    }
    else {
        console.log("My turn", username);
        startCount();
        div.classList.add('message-sender');
        div.innerHTML = 
        `
            <div>              
                <p class="meta-sender">${message.username} <span>${message.time}</span></p>
                <span class="chat-text-sender">
                    ${message.text} <span class="time-sender">${count}s</span>
                </p>
            </div>
        `;
    }       

    document.querySelector('.chat-messages').appendChild(div);
    var seperator = document.createElement('br');
    document.querySelector('.chat-messages').appendChild(seperator);
}

function checkWord(msg) {   
    // console.log(wordArr.sort());
     
    let regex = /\s/;
    let found = binarySearch(wordArr.sort(), msg, 0, wordArr.length);
    // console.log(found);
    
    if(found || msg.match(regex)) {        
        document.getElementById('msg').style.border = '1px solid #f44336';
        document.getElementById('sendBtn').disabled = true;
    } else {        
        document.getElementById('msg').style.border = '1px solid #ffffff';
        document.getElementById('sendBtn').disabled = false;
    }        
}

document.addEventListener('DOMContentLoaded', function() {
    // nav menu
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'left'});
    
  });


function play() {
    // document.getElementById("startBtn").style.display = 'none';
    // callTimer();
    startCount();
}

// function callTimer() {
//     sec = userCount > 1 ? (userCount - 1) * 10000 : 10000;
//     console.log(user_turn);
    
//     if(user_turn){    
//         console.log(username);
        
//         interval = setInterval(
//             "handleIntervalTasks()", sec
//         );
//     }
// }

// function handleIntervalTasks() { 
    
//     let index = -1;
//     userArr.map((user, i) => {
//         if(user.username === username) {
//             user.turn = false;
//             index = i;
//         }        
//     });
    
//     index === userArr.length-1 ? index = 0 : index += 1;    
//     userArr[index].turn = true;

//     console.log(userArr);    
//     socket.emit("turn", userArr);
//     startCount();  
//     // callTimer();
// }

function timedCount() {
    document.getElementById("timer").innerText = '0' + count;
    count = count - 1;
    // console.log(count);    
    t = setTimeout(timedCount, 1000);
    if( count < 0 ) {
        // document.getElementById('msg').disabled = true;
        document.getElementById('msg').placeholder = "SORRY!! TIME OUT!!";
        document.getElementById('msg').focus();

        socket.emit("timeout", username);

        stopCount();
        // setInterval(function() {
        //     stopCount();
        //     startCount(sec)
        // }, sec);
    }
}

socket.on("timeoutRes", response => {
    
    const div = document.createElement('div');
        
    div.classList.add('timeout-msg');
    div.innerHTML = 
    `        
        <p>${response.username + ' ' + response.msg} </p>
    `;
    document.querySelector('.chat-messages').appendChild(div);
    if(response.username !== username) startCount();  
});

function startCount() {
    // console.log("I am called!!!");
    
  if (!timer_is_on) {
    timer_is_on = 1;
    timedCount();
  }
}

function stopCount() {
  clearTimeout(t);
  timer_is_on = 0;
  count = 9;
}

//Binary Search
function binarySearch(arr, element, start, end) { 

    if (start > end) return false; 

    let mid = Math.floor((start + end)/2);

    if (arr[mid] === element) return true; 

    if(arr[mid] > element)  
        return binarySearch(arr, element, start, mid-1); 
    else    
        return binarySearch(arr, element, mid+1, end);  
} 


