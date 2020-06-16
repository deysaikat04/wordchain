let words = [];

function wordJoin( word ) {

    words.push(word);

    return words;
}

function getWords( ) {
    return words;
}

function clearWords() {
    words = [];
}


module.exports = {
    wordJoin,
    getWords,
    clearWords
}