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

function addClass(elem, classname) {
    var oldclass = elem.getAttribute("class");
    if (oldclass == null) {
        elem.setAttribute("class", classname);
    } else if (oldclass.indexOf(classname) == -1) {
        elem.setAttribute("class", oldclass + " " + classname);
    }
}

function prepareHole(callback) {
    var hole_list = document.getElementsByClassName('hole');
    var line_list = document.getElementsByClassName("game-line");
    var line_count = hole_list.length / line_list.length;
    var layout_num = 1;
    var layout_now = 1;
    var count = 0;

    for (var i = 0; i < hole_list.length; ++i) {
        hole_list[i].id = "hole_" + (i + 1);
        addClass(hole_list[i], "layout_" + layout_now);
        hole_list[i].style.backgroundColor = "#cdcdcd";

        count++;
        layout_now++;
        if (count == line_count) {
            count = 0;
            layout_num++;
            layout_now = layout_num;
        }
    }

    if (typeof callback == 'function') callback();
}

function prepareButton() {
    var btn = document.getElementsByClassName("console")[0];
    btn.onclick = consoleEvent;
    btn.start = false;
}

function consoleEvent() {
    var hole_list = document.getElementsByClassName("layout_1");
    this.onclick = startGame;
    this.disabled = true;
    diagonalChange(hole_list, 1, 15, consoleCallback) ;
}

function consoleCallback() {
    var btn = document.getElementsByClassName('console')[0];
    btn.disabled = false;
    btn.click();
}

function startGame() {
    if (this.timing)
        clearTimeout(this.timing);

    if (this.start == false) {
        clearGameLayout();
        document.getElementById('score').value = 0;
        document.getElementById('result').value = "Playing";
        document.getElementById('time').value = 31;

        var randId = parseInt(Math.random() * 60 + 1);
        var hole = document.getElementById("hole_" + randId);
        setMole(hole);

        this.start = true;
        gameTiming(this, 1000);
    } else {
        document.getElementById('result').value = "Stop";
        unbindHole();
        this.start = false;
    }
}

function setMole(hole) {
    hole.style.background = 'url(images/mole.png) no-repeat center';
    hole.style.backgroundSize = "contain";
}

function clearGameLayout() {
    var score = document.getElementById('score');
    var hole_list = document.getElementsByClassName('hole');

    for (var i = 0; i < hole_list.length; ++i) {
        hole_list[i].style.background = null;

        hole_list[i].onclick = function() {
            var randId = parseInt(Math.random() * hole_list.length + 1);
            if (this.style.background == "") {
                score.value = parseInt(score.value) - 1;
            } else {
                score.value = parseInt(score.value) + 1;
                this.style.background = "";
                setMole(document.getElementById("hole_" + randId));
            }
        }
    }
}

function unbindHole() {
    var hole_list = document.getElementsByClassName('hole');

    for (var i = 0; i < hole_list.length; ++i)
        hole_list[i].onclick = function() {}
}

function gameTiming(console, interval) {
    var timeText = document.getElementById('time');
    var scoreText = document.getElementById('score');
    var result = document.getElementById('result');

    timeText.value = timeText.value - 1;

    if (timeText.value != 0) {
        console.timing = setTimeout(function() { gameTiming(console, interval); }, parseInt(interval));
    } else {
        unbindHole();
        result.value = "Game Over";
        console.start = false;
        alert("Gameover!\nScore: " + scoreText.value);
    }
}

function diagonalChange(firstlayout, layout_num, max_layout, callback) {
    var hole, hole_list, color, red, green, blue;

    hole = firstlayout[0];
    color = hole.style.backgroundColor.split('(')[1].split(')')[0].split(',');
    red = parseInt(color[0]);
    green = parseInt(color[1]);
    blue = parseInt(color[2])

    if (red != 255) {
        for (var i = 0; i < firstlayout.length; ++i) {
            firstlayout[i].style.backgroundColor = 'rgb('+(red+5)+', '+(green+5)+', '+(blue+5)+')';
        }
        this.movement = setTimeout(function() {diagonalChange(firstlayout, layout_num, max_layout, callback);}, 20)
    } else {
        for (var i = 0; i < firstlayout.length; ++i)
            firstlayout[i].style.opacity = 1;
        if (layout_num == max_layout && typeof callback == 'function')
            callback();
    }
    if (red == 230 && layout_num < max_layout) {
        hole_list = document.getElementsByClassName("layout_" + (layout_num + 1));
        diagonalChange(hole_list, layout_num + 1, max_layout, callback);
    }
}

addEventLoad(prepareHole(prepareButton));
