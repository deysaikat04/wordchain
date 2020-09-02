var users = [];
const TIMEOUT_SCORE_DEDUCT = 10;

function userJoin(id, username, room) {
    const user = { id, username, room, turn: false, timeout: 0, score: 0 };

    users.push(user);

    return user;
}

function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

//update users array based on turn
function updateUser(id) {
    users.map((user) => {
        if (user.id === id) {
            user.turn = false;
        }
    });
}

//get next user
function getNextUser(id) {
    var next = -1;
    users.map((user, index) => {
        if (user.id === id) {

            if (index === users.length - 1) {
                next = 0;
            } else {
                next = index + 1
            }
        }
    });

    if (next >= 0) return users[next];
}

//set the score
function setScore(id, score) {
    users.map((user) => {
        if (user.id === id) {
            user.score += score;
        }
    });
}

//get the score
function getScore(room) {
    return users.filter(user => user.room === room);
}

//set the timeout count
function setTimeout(id, timeout) {
    users.map((user) => {
        if (user.id === id) {
            user.timeout += timeout;
            user.score -= TIMEOUT_SCORE_DEDUCT;
        }
    });

    // console.log(users);
}


module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    updateUser,
    getNextUser,
    setScore,
    getScore,
    setTimeout
}