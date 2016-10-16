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

// 生成holes，给控制按钮绑定事件
function prepareGame() {
    var game = document.getElementsByClassName("game")[0];
    var game_line, hole;
    var btn = document.getElementsByClassName("console")[0];

    for (var i = 0; i < 8; ++i) {
        game_line = document.createElement("div");
        game_line.className = "game-line";
        for (var j = 0; j < 8; ++j) {
            hole = document.createElement("div");
            hole.className = "hole";
            game_line.appendChild(hole);
        }
        game.appendChild(game_line);
    }

    btn.onclick = startGame();
}

function startGame() {
    var start = false;  // 标志游戏是否开始
    var timing;  // 计时器
    var mole_id;  // 地鼠出现的位置

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
            alert("Gameover!\nScore: " + scoreText.value);
        }
    }

    // 给每个hole绑定事件
    // 当游戏开始时即start == true，
    // 点击有地鼠的hole时，分数加1；
    // 否则，分数减1，并且分数不能为负数。
    for (var i = 0; i < hole_list.length; ++i) {
        hole_list[i].onclick = function() {
            if (!start) return;
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

    return function () {
        if (timing)
            clearTimeout(timing);

        if (start == false) {
            if (parseInt(timeText.value) == 0) {  // 已经结束，重置
                for (var i = 0; i < hole_list.length; ++i)
                    removeClass(hole_list[i], "mole");
                scoreText.value = 0;
                result.value = "Playing";
                timeText.value = 31;

                mole_id = parseInt(Math.random() * hole_list.length);
                addClass(hole_list[mole_id], "mole");

                start = true;
                gameTiming();
            } else {  // 暂停时，继续
                timeText.value = parseInt(timeText.value) + 1;
                result.value = "Playing";
                start = true;
                gameTiming();
            }
        } else {
            result.value = "Stop";
            start = false;
        }
    };
}

addEventLoad(prepareGame);
