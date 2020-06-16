const moment = require('moment');
const words = require('./words');

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a'),
        words: words.getWords()
    }
}

module.exports = formatMessage;