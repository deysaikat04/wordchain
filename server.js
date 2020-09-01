const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const formatMessage = require('./utils/messages');
const { wordJoin, clearWords } = require('./utils/words');
const { userJoin, getCurrentUser, userLeave, getRoomUsers, updateUser, getNextUser, setScore, getScore } = require('./utils/users');

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

    socket.on("timeout", (username) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('timeoutRes', ({ username, msg: 'Timeout!!' }));
    });

    socket.on("score", ({ count }) => {
        const user = getCurrentUser(socket.id);

        setScore(user.id, count);

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });


    // socket.on('typing', (data) => {
    //     if (data.typing == true)
    //         io.emit('display', data)
    //     else
    //         io.emit('display', data)
    // })

    socket.on("startTheGame", room => {
        let userArr = [];
        userArr = getRoomUsers(room);

        if (userArr[0]) {
            userArr[0].turn = true;
        }


        io.to(room).emit("nextUser", userArr[0]);
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