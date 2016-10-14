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

function prepareHole(callback) {
    var hole_list = document.getElementsByClassName('hole');

    for (var i = 0; i < hole_list.length; ++i)
        hole_list[i].id = "hole_" + (i + 1);

    if (typeof callback == 'function') callback();
}

function prepareButton() {
    var startGame = function () {
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

        var resetGame = function () {
            if (mole_id)
                removeClass(document.getElementById("hole_" + mole_id), "mole");
            bindHole();
        }

        var bindHole = function () {
            for (var i = 0; i < hole_list.length; ++i) {
                hole_list[i].onclick = function() {
                    mole_id = parseInt(Math.random() * hole_list.length + 1);
                    if (!hasClass(this, "mole")) {
                        scoreText.value = parseInt(scoreText.value) - 1;
                    } else {
                        scoreText.value = parseInt(scoreText.value) + 1;
                        removeClass(this, "mole");
                        addClass(document.getElementById("hole_" + mole_id), "mole");
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
                resetGame();
                scoreText.value = 0;
                result.value = "Playing";
                timeText.value = 31;

                mole_id = parseInt(Math.random() * 60 + 1);
                var hole = document.getElementById("hole_" + mole_id);
                addClass(hole, "mole");

                start = true;
                gameTiming();
            } else {
                result.value = "Stop";
                unbindHole();
                start = false;
            }
        };
    }

    var btn = document.getElementsByClassName("console")[0];
    btn.onclick = startGame();
}

addEventLoad(prepareHole(prepareButton));
