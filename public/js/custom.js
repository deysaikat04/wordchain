const socket = io();

var wordArr = [];
var msg;
var alphabets = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var currUser = '';
var nextUser;
var count = 9;
var t;
var timer_is_on = 0;
var MAX_WAITING = 10000;
var MAX_TIMEOUT = 3;

var user_turn = false;
var userArr = [];
var noOfUsers;
var myIndex = -1;

var timeoutCount = {};
var myScore = 0;
var myTimeout = 0;

//typing
var typing = false;
var typingTimeout = undefined;
var typingUser;

var startingLetter;

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const userList = document.getElementById('side-menu');

var userCount = 0;

// Get username and room
const { username, room, token, gameTime } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

function generateRandomLetter() {
    let i = Math.floor((Math.random() * 25));
    return alphabets[i];
}

// Set the start button who creates the room
function setStart() {
    document.getElementById('rommCode').innerHTML = `Room: ${room}`;

    if (token === "true") {
        document.getElementById("startBtn").style.display = 'block';
    } else {
        document.getElementById("startBtn").style.display = 'none';
    }
}

//start the game
function play() {
    if (noOfUsers > 1) {

        document.getElementById("startBtn").style.display = 'none';
        document.getElementById('sendBtn').disabled = true;
        document.getElementById('msg').focus();

        document.getElementById("navbar").style.display = 'none';
        document.getElementById("scorebar").style.display = 'block';

        document.getElementById("startBtn").removeAttribute("data-target");
        document.getElementById("startBtn").classList.remove("modal-trigger");

        let letter = generateRandomLetter();
        socket.emit("startTheGame", { room, gameTime, letter });
        socket.emit("gameTimeSpan", room);
    } else {

        document.getElementById("startBtn").setAttribute("data-target", "lessUser");
        document.getElementById("startBtn").classList.add("modal-trigger");
    }
}

//get random letter to display all players
socket.on('letterToBeginWith', letter => {
    startingLetter = letter;

    document.querySelector('.chat-messages').innerHTML = "";

    const div = document.createElement('div');

    div.classList.add('startingLetter-msg');
    div.innerHTML =
        `        
        <p>Let's begin with <span class="letter">'${startingLetter}'</span></p> 
    `;
    document.querySelector('.chat-messages').appendChild(div);
})

//calculate dynamic grid per user
function calculateGrid() {
    var grid = 0;
    switch (noOfUsers) {
        case 2: {
            grid = 6;
            break;
        }
        case 3: {
            grid = 4;
            break;
        }
        default: {
            grid = 3;
            break;
        }
    }
    return grid;
}

function stopTheGame() {
    stopCount();
    document.getElementById('sendBtn').disabled = true;

    const elem = document.getElementById('gameOver');
    const instance = M.Modal.init(elem, { dismissible: false });
    instance.open();

    let grid = calculateGrid();

    userArr.map((user, index) => {
        const div = document.createElement('div');

        div.innerHTML =
            `
            <div class="col s${grid}" >
                <p>${user.username}</p>
                <span>${user.score}</span>
            </div>
        `;

        document.querySelector('.scores').appendChild(div);
    });
}

//countdown 
socket.on("countdown", data => {

    document.getElementById("countdown").innerText = data;
    if (data == '0:00') {
        stopTheGame();
    }
});


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

// message from bot 
socket.on('botMessage', message => {
    currUser = message.username;

    const div = document.createElement('div');
    div.classList.add('bot-msg');
    div.innerHTML =
        `        
        <p>${message.text}</p> 
    `;
    document.querySelector('.chat-messages').appendChild(div);
    var seperator = document.createElement('br');
    // document.querySelector('.chat-messages').appendChild(seperator);

    chatMessages.scrollTop = chatMessages.scrollHeight;


});

//first letter of words
socket.on('msgLetter', data => {
    if (data.username !== username) {
        startingLetter = data.msg;
        document.getElementById('msg').placeholder = `Start with: ${startingLetter}`;
        document.getElementById('msg').focus();
    }
});

socket.on('updatedScores', users => {
    userArr = users;
    users.map((user, index) => {
        document.getElementById(`player${index + 1}-score`).innerText = user.score;

    });
});

//get the users and room details
socket.on('roomUsers', ({ room, users }) => {

    userArr = users;
    noOfUsers = users.length;

    document.querySelector('.scorerow').innerHTML = "";

    userArr.map((user, index) => {
        if (noOfUsers > 1) {
            createScoreBoard(index, user.username, user.score);
        }
        if (user.username === username) {
            user.turn = true;
            myIndex = index;
        }
        let name = user.username;
        timeoutCount[name] = 0;
    });

    socket.emit("turn", userArr);

    userCount = users.length;

    userList.innerHTML = `
        <li><a class="subheader">WORDCHAIN</a></li> 
        ${users.map(user => `
            <li>                
                <a href="" class="waves-effect">
                    <i class="material-icons">account_circle</i>
                    ${user.username}
                    <span class="score">${user.score}</span>
                </a>            
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

    if (user_turn) {

        stopCount();

        document.getElementById('sendBtn').disabled = true;

        msg = e.target.elements.msg.value;

        //Emit a message to server
        socket.emit('chatMessage', msg);

        socket.emit('startLetter', msg.slice(-1).toUpperCase());

        e.target.elements.msg.value = '';
        e.target.elements.msg.focus();
        document.getElementById('msg').placeholder = "";
        socket.emit("nextTurn", nextUser);

        user_turn = false;


    }
    //send score  
    socket.emit("score", { myScore });

});



//get next user
socket.on("nextUser", data => {
    nextUser = data;
    document.getElementById("navbar").style.display = 'none';
    document.getElementById("scorebar").style.display = 'block';

    userArr.map((user, index) => {

        if (user.username == nextUser.username) {
            document.getElementById(`player${index + 1}`).classList.add('player-active');
        } else {
            document.getElementById(`player${index + 1}`).classList.remove('player-active');
        }
    });

    if (data.username === username) {
        // console.log("MY TURN ", username);
        document.getElementById('sendBtn').disabled = false;
        document.getElementById('msg').focus();

        user_turn = data.turn;
        startCount();
    }
})


//output message to DOM
function outputMessage(message) {
    classNames = ['message-sender', 'message-sender-two', 'message-sender-three'];
    chatColor = '';
    otherPlayersArr = [];

    userArr.map((user, index) => {
        if (index == myIndex) {
            chatColor = 'message';

        } else {
            otherPlayersArr.push(user.username);
        }
    })

    const div = document.createElement('div');
    if (message.username === username) {

        div.classList.add('message');
        div.innerHTML =
            `
            <div>   
                <p class="meta">${message.username} </p>
                <p class="chat-text">
                    ${message.text} 
                </p>
            </div>
        `;
    }
    else {

        otherPlayersArr.map((user, index) => {

            if (user == message.username) {
                div.classList.add(classNames[index]);
            }
        })
        div.innerHTML =
            `
            <div>              
                <p class="meta-sender">${message.username}</p>
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


//check word form list if it's already used
function checkWord(msg) {
    // https://api.datamuse.com/words?rel_gen=kkiss    

    let regex = /^[a-zA-z]+$/;
    let found = binarySearch(wordArr.sort(), msg, 0, wordArr.length);

    if (user_turn) {
        if (msg[0].toUpperCase() !== startingLetter.toUpperCase()) {
            document.getElementById('msg').style.border = '1px solid #f44336';
            document.getElementById('sendBtn').disabled = true;
        }
        else if (found || !msg.match(regex)) {
            document.getElementById('msg').style.border = '1px solid #f44336';
            document.getElementById('sendBtn').disabled = true;
        } else {
            document.getElementById('msg').style.border = '1px solid #ffffff';
            document.getElementById('sendBtn').disabled = false;
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // nav menu
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, { edge: 'left' });

    var elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);


});


function timedCount() {
    document.getElementById("timer").innerText = '0' + count;
    count = count - 1;

    t = setTimeout(timedCount, 1000);

    if (count < 0) {

        document.getElementById('msg').placeholder = "SORRY!! TIME OUT!!";
        document.getElementById('msg').style.background = '#cccccc';

        myTimeout += 1;

        socket.emit("timeout", { username, myTimeout });

        document.getElementById('msg').value = '';
        document.getElementById('sendBtn').disabled = true;

        user_turn = false;
        socket.emit("nextTurn", nextUser);

        msg ? socket.emit('startLetter', msg.slice(-1).toUpperCase()) : null;

        stopCount();
    }
}

// timeout message 
socket.on("timeoutRes", response => {

    document.getElementById('sendBtn').disabled = true;
    const div = document.createElement('div');

    div.classList.add('timeout-msg');
    div.innerHTML =
        `        
        <p>${response.username + ' ' + response.msg} </p>
    `;
    document.querySelector('.chat-messages').appendChild(div);
    // if (response.username !== username) startCount();

    chatMessages.scrollTop = chatMessages.scrollHeight;

});


function startCount() {
    if (!timer_is_on) {
        timer_is_on = 1;
        timedCount();
    }
}

function stopCount() {
    clearTimeout(t);
    timer_is_on = 0;
    myScore = count;
    count = 9;
}

//Binary Search
function binarySearch(arr, element, start, end) {

    if (start > end) return false;

    let mid = Math.floor((start + end) / 2);

    if (arr[mid] === element) return true;

    if (arr[mid] > element)
        return binarySearch(arr, element, start, mid - 1);
    else
        return binarySearch(arr, element, mid + 1, end);
}


function createScoreBoard(i, name, score) {
    let grid = calculateGrid();

    if (document.getElementById('scoreboard').childNodes.length <= userArr.length) {

        const div = document.createElement('div');
        div.innerHTML =
            `
        <div class="col s${grid}" id="player${i + 1}">
        <p id="player${i + 1}-name">${name}</p>
        <span id="player${i + 1}-score">${score}</span>
        </div>
        `;
        document.querySelector('.scorerow').appendChild(div);
    }
}