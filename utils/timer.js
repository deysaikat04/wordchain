function setTime(time) {
    return time;
}

function startTimer(time) {
    // console.log("I am called");
    // var presentTime = 003 + ":" + 20;
    var presentTime = time;

    var timeArray = presentTime.split(/[:]+/);
    var m = timeArray[0];
    var s = checkSecond((timeArray[1] - 1));
    if (s == 59) { m = m - 1 }

    if (m < 0) {
        clearTimeout();
        return -1;
    }

    // document.getElementById('timer').innerHTML =
    //     m + ":" + s;
    // setTimeout(startTimer, 1000);
    return (m + ":" + s);
}

function checkSecond(sec) {
    if (sec < 10 && sec >= 0) { sec = "0" + sec }; // add zero in front of numbers < 10
    if (sec < 0) { sec = "59" };
    return sec;
}

module.exports = { startTimer }; 