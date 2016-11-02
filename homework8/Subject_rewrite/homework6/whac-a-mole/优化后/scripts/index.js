var globalVar = {
    start: undefined,
    score: undefined,
    timing: undefined,
    mole_id: undefined,
    $timeText: undefined,
    $scoreText: undefined,
    $result: undefined,
    $hole_list: undefined
};

function init_game() {
    globalVar.start = false;
    globalVar.score = 0;
    globalVar.$timeText = $('#time');
    globalVar.$scoreText = $('#score');
    globalVar.$result = $('#result');
    globalVar.$hole_list = $('.hole');
}

// 生成地鼠洞
function prepareHoles() {
    var hole_line = '<div class="game-line"></div>';
    var hole = '<div class="hole"></div>';

    var $game = $(".game");
    for (var i = 0; i < 8; ++i)
        $game.append(hole_line);

    var $game_line = $(".game-line");
    for (var i = 0; i < 8; ++i)
        $game_line.append(hole);
}

// 游戏计时器
function gameTiming() {
    var time = getTime();
    globalVar.$timeText.val(time - 1);

    if (time - 1 !== 0) {
        globalVar.timing = setTimeout(gameTiming, 1000);
    } else {
        globalVar.start = false;
        globalVar.$result.val("Game Over");
        alert("Gameover!\nScore: " + globalVar.$scoreText.val());
    }
}

// 点击每个地鼠洞的事件
function holeEvent() {
    if (!globalVar.start) return;
    if (!$(this).hasClass("mole")) {
        if (globalVar.score > 0) globalVar.score--;
    } else {
        $(this).removeClass("mole");
        globalVar.score++;
        globalVar.mole_id = randID();
        globalVar.$hole_list.eq(globalVar.mole_id).addClass("mole");
    }
    globalVar.$scoreText.val(globalVar.score);
}

function getTime() {
    return parseInt(globalVar.$timeText.val());
}

function randID() {
    return parseInt(Math.random() * globalVar.$hole_list.length);
}

function startGame() {
    if (globalVar.timing)
        clearTimeout(globalVar.timing);

    if (globalVar.start == false && getTime() == 0) {
        restartGame();  // 重新开始游戏
    } else if (globalVar.start == false) {
        continueGame();  // 继续游戏
    } else {
        pauseGame();  // 暂停游戏
    }
}

function restartGame() {
    globalVar.start = true;
    globalVar.score = 0;
    globalVar.mole_id = randID();
    globalVar.$hole_list.removeClass("mole");
    globalVar.$scoreText.val(0);
    globalVar.$timeText.val(31);
    globalVar.$result.val("Playing");
    globalVar.$hole_list.eq(globalVar.mole_id).addClass("mole");
    gameTiming();
}

function continueGame() {
    globalVar.start = true;
    globalVar.$timeText.val(getTime() + 1);
    globalVar.$result.val("Playing");
    gameTiming();
}

function pauseGame() {
    globalVar.start = false;
    globalVar.$result.val("Stop");
}

$(function () {
    prepareHoles();
    init_game();
    $(".console").click(startGame);
    globalVar.$hole_list.click(holeEvent);
});
