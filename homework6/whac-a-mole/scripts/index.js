function addEventLoad(func) {
    var oldevent = window.onload;
    if (oldevent != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            func();
            oldevent();
        }
    }
}

function hasClass(elem, classname) {
    return elem.className.indexOf(classname) != -1;
}

function addClass(elem, classname) {
    if (elem.className == "") {
        elem.className = classname;
    } else if (!hasClass(elem, classname)) {
        elem.className = elem.className + " " + classname;
    }
}

function removeClass(elem, classname) {
    if (hasClass(elem, classname)) {
        var reg = new RegExp('(\\s*)' + classname + '(\\s*)');
        elem.className = elem.className.replace(reg, ' ');
    }
}

function prepareButton() {
    var btn = document.getElementsByClassName("console")[0];
    btn.onclick = startGame();
}

function startGame() {
    var start = false;
    var timing;
    var mole_id;

    var timeText = document.getElementById('time');
    var scoreText = document.getElementById('score');
    var result = document.getElementById('result');
    var hole_list = document.getElementsByClassName('hole');

    var gameTiming = function () {
        var time = parseInt(timeText.value);
        timeText.value = time - 1;

        if (time - 1 != 0) {
            timing = setTimeout(gameTiming, 1000);
        } else {
            start = false;
            result.value = "Game Over";
            unbindHole();
            alert("Gameover!\nScore: " + scoreText.value);
        }
    }

    var bindHole = function () {
        for (var i = 0; i < hole_list.length; ++i) {
            removeClass(hole_list[i], "mole");
            hole_list[i].onclick = function() {
                mole_id = parseInt(Math.random() * hole_list.length);
                if (!hasClass(this, "mole")) {
                    if (parseInt(scoreText.value) != 0)
                        scoreText.value = parseInt(scoreText.value) - 1;
                } else {
                    scoreText.value = parseInt(scoreText.value) + 1;
                    removeClass(this, "mole");
                    addClass(hole_list[mole_id], "mole");
                }
            }
        }
    }

    var unbindHole = function () {
        for (var i = 0; i < hole_list.length; ++i)
            hole_list[i].onclick = function() {}
    }

    return function () {
        if (timing)
            clearTimeout(timing);

        if (start == false) {
            bindHole();
            scoreText.value = 0;
            result.value = "Playing";
            timeText.value = 31;

            mole_id = parseInt(Math.random() * hole_list.length);
            addClass(hole_list[mole_id], "mole");

            start = true;
            gameTiming();
        } else {
            result.value = "Stop";
            unbindHole();
            start = false;
        }
    };
}

addEventLoad(prepareButton);
