const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const formatMessage = require('./utils/messages');
const { wordJoin, clearWords } = require('./utils/words');
const { startTimer } = require('./utils/timer');
const { userJoin, getCurrentUser, userLeave, getRoomUsers, updateUser, getNextUser, setScore, getScore, setTimeout } = require('./utils/users');

var totalTime;
//set static folder
app.use(express.static(path.join(__dirname, 'public')));



app.get('/favicon.ico', (req, res) => res.status(204));

const botName = 'WordChain Bot';


//Run when client connects
io.on('connection', (socket) => {

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        //welcome current user
        socket.emit('botMessage', formatMessage(botName, 'Welcome in WordChain'));

        //Broadcast when user conencts
        socket.broadcast.to(user.room).emit('botMessage', formatMessage(botName, `${user.username} has joined!`));

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });

    //listen for chatMessage 
    socket.on('chatMessage', (msg) => {
        // console.log(msg);
        const user = getCurrentUser(socket.id);
        wordJoin(msg);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //listen for chatMessage
    socket.on('startLetter', (msg) => {
        const user = getCurrentUser(socket.id);
        let username = user.username;
        io.to(user.room).emit('msgLetter', { username, msg });
    });

    socket.on("timeout", ({ username, myTimeout }) => {
        const user = getCurrentUser(socket.id);

        setTimeout(user.id, myTimeout);
        let userArr = getScore(user.room);

        io.to(user.room).emit('updatedScores', userArr);
        io.to(user.room).emit('timeoutRes', ({ username, msg: 'Timeout!!' }));
    });

    socket.on("score", ({ myScore }) => {
        const user = getCurrentUser(socket.id);

        setScore(user.id, myScore);
        let userArr = getScore(user.room);
        io.to(user.room).emit('updatedScores', userArr);
    });



    socket.on("startTheGame", ({ room, gameTime }) => {
        totalTime = gameTime;

        let userArr = [];
        userArr = getRoomUsers(room);

        if (userArr[0]) {
            userArr[0].turn = true;
        }

        io.to(room).emit("nextUser", userArr[0]);
    });

    socket.on("gameTimeSpan", room => {
        data = totalTime + ":" + 00;


        setInterval(() => {
            if (data != -1) {
                data = startTimer(data);
                data != '-1' ? io.to(room).emit("countdown", data) : null;
            } else {
                clearInterval();
            }
        }, 1000);
    });



    socket.on("nextTurn", currUser => {
        const user = getCurrentUser(currUser.id);

        updateUser(currUser.id);

        let nextUser = getNextUser(currUser.id);

        if (nextUser) {
            nextUser.turn = true;
        }
        io.to(user.room).emit("nextUser", nextUser);

    });

    //runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id); 

        if (user) {
            io
                .to(user.room)
                .emit('botMessage', formatMessage(botName, `${user.username} has left the game!`));

            clearWords();

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }


    });

});


app.get('/', function (req, res) {
    res.redirect('/index.html');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server is running on ${PORT}`));