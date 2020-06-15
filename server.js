const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

// function ignoreFavicon(req, res, next) {
//     if (req.originalUrl === '/favicon.ico') {
//       res.status(204).json({nope: true});
//     } else {
//       next();
//     }
//   };

//   app.use(ignoreFavicon);

app.get('/favicon.ico', (req, res) => res.status(204));

const botName = 'WordChain Bot';
//Run when client connects
io.on('connection', (socket) => {

    socket.on('joinRoom', ({ username, room }) => {
        // const user = userJoin(socket.io, username, room);
        const user = userJoin(socket.id, username, room);
       

        socket.join(user.room);

        //welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome in WordChain'));

        //Broadcast when user conencts
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined!`));

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });

    //listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id); 

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
                
        if(user) {
            io
            .to(user.room) 
            .emit('message', formatMessage(botName, `${user.username} has left the game!`));

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
 
        
    });

});

app.get('/', function(req, res){
    res.redirect('/index.html');
 });

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server is running on ${PORT}`));