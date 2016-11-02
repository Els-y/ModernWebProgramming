var globalVar = {
    start: undefined,
    level: undefined,
    img: undefined,
    empty_pos: undefined,
    step: undefined,
    time: undefined,
    timing: undefined,
    blocks: undefined,
    level_btn: undefined,
    start_btn: undefined,
    img_btn: undefined,
    step_screen: undefined,
    time_screen: undefined,
};

// 初始化全局变量
function init_global() {
    globalVar.start = false;
    globalVar.level = 4;
    globalVar.img = 0;
    globalVar.empty_pos = {row: undefined, col: undefined},
    globalVar.$level_btn = $(".btn-level");
    globalVar.$start_btn = $(".btn-start");
    globalVar.$img_btn = $(".btn-img");
    globalVar.$step_screen = $(".step-screen");
    globalVar.$time_screen = $(".time-screen");
}

// 生成拼图块儿
function prepareBlock() {
    var $puzzle = $(".puzzle");
    _.times(globalVar.level * globalVar.level - 1, function (i) {
        var block = '<div class="block level-' + globalVar.level + ' level-' + globalVar.level + '-block-' + i + ' img-' + globalVar.img + 
                         ' level-' + globalVar.level + '-row-' + getRowByOrderNumber(i) +
                         ' level-' + globalVar.level + '-col-' + getColByOrderNumber(i) +
                         '"></div>';
        $puzzle.append(block);
    });
    globalVar.$blocks = $(".block");
    globalVar.$blocks.click(blockEvent);
}

function getRowByOrderNumber(OrderNumber) {
    return Math.floor(OrderNumber / globalVar.level);
}

function getColByOrderNumber(OrderNumber) {
    return OrderNumber % globalVar.level;
}

// 每个拼图块儿的点击事件
function blockEvent() {
    if (globalVar.start) {
        var pos = getPostion($(this));  // 获得当前拼图块儿的位置
        if (adjacentEmpty(pos)) {  // 判断是否与空块儿相邻，相邻则移动；否则跳过
            moveTo($(this), globalVar.empty_pos);
            globalVar.empty_pos = pos;  // 更新空块儿的位置
            globalVar.step++;  // 记录步数
            globalVar.$step_screen.val(globalVar.step);
            completeHandler();  // 判断处理完成事件
        }
    }
}

// 获取拼图块儿的位置
function getPostion($block) {
    var pos = {};
    var e_classname = $block.attr("class");
    var reg_row = new RegExp("level-" + globalVar.level + "-row-(\\d+)");
    var reg_col = new RegExp("level-" + globalVar.level + "-col-(\\d+)");

    pos.row = parseInt(reg_row.exec(e_classname)[1]);
    pos.col = parseInt(reg_col.exec(e_classname)[1]);

    return pos;
}

// 判断是否与空块儿相邻，传进来的是一个对象，里面含有row，col
function adjacentEmpty(position) {
    if (position.row + 1 == globalVar.empty_pos.row && position.col == globalVar.empty_pos.col)
        return true;
    else if (position.row - 1 == globalVar.empty_pos.row && position.col == globalVar.empty_pos.col)
        return true;
    else if (position.row == globalVar.empty_pos.row && position.col + 1 == globalVar.empty_pos.col)
        return true;
    else if (position.row == globalVar.empty_pos.row && position.col - 1 == globalVar.empty_pos.col)
        return true;
    else
        return false;
}

// 移动拼图块儿 block 到 position
function moveTo($block, position) {
    var pos = getPostion($block);

    $block.removeClass("level-" + globalVar.level + "-row-" + pos.row)
                .removeClass("level-" + globalVar.level + "-col-" + pos.col)
                .addClass("level-" + globalVar.level + "-row-" + position.row)
                .addClass("level-" + globalVar.level + "-col-" + position.col);
}

// 处理完成事件
function completeHandler() {
    if (ifcomplete()) {
        clearTimeout(globalVar.timing);
        globalVar.start = false;
        globalVar.$start_btn.html("Start").removeClass("btn-clear").addClass("btn-start");
        globalVar.$level_btn.removeClass("btn-disabled");
        globalVar.$img_btn.removeClass("btn-disabled");
        fadeToggle($(".name"), "Congratulations");
    }
}

// 判断是否完成拼图
function ifcomplete() {
    if (globalVar.empty_pos.row !== globalVar.level - 1 || globalVar.empty_pos.col !== globalVar.level - 1)
        return false;
    return _.every(globalVar.$blocks, function (block) {
        var pos = getPostion($(block));
        var correct_pos = getCorrectPositionByClassName($(block).attr("class"));
        return _.isEqual(pos, correct_pos);
    });
}


// 用来切换最上面的文字提示，value对应更新的文字，
// fadeIn用来在该函数内部调用自身的时候判断是隐藏还是显示
function fadeToggle($elem, value, fadeIn) {
    fadeIn = fadeIn || false;

    if (fadeIn === false) {
        $elem.addClass("hidden");
        setTimeout(function () { fadeToggle($elem, value, true) }, 250);
    } else {
        $elem.html(value).removeClass("hidden");
    }
}

function prepareButton() {
    globalVar.$level_btn.click(levelEvent);
    globalVar.$start_btn.click(startEvent);
    globalVar.$img_btn.click(imgEvent);
}

// level按钮的点击事件
function levelEvent() {
    if (globalVar.start) return;
    var $puzzle = $(".puzzle");
    var level_name = ["Easy", "Medium", "Hard"];

    globalVar.level = globalVar.level + 1 === 6 ? 3 : globalVar.level + 1;
    $(this).html(level_name[globalVar.level - 3]);
    $puzzle.empty();
    prepareBlock();
}

// start按钮的点击事件，包括clear的事件
function startEvent() {
    if (globalVar.start) {
        clearHandler();
        $(this).html("Start").removeClass("btn-clear").addClass("btn-start");
    } else {
        startHandler();
        $(this).html("Clear").removeClass("btn-start").addClass("btn-clear");
    }
}

// start按钮用来开始游戏的事件处理
function startHandler() {
    resetGame(true);
    globalVar.empty_pos = randomBlocks();
    globalVar.timing = setTimeout(gameTiming, 100);
    fadeToggle($(".name"), "Playing");
}

function resetGame(ifstart) {
    globalVar.start = ifstart;
    globalVar.$level_btn[ifstart ? 'addClass' : 'removeClass']("btn-disabled");
    globalVar.$img_btn[ifstart ? 'addClass' : 'removeClass']("btn-disabled");
    globalVar.step = 0;
    globalVar.time = 0;
    globalVar.$step_screen.val(0);
    globalVar.$time_screen.val(globalVar.time.toFixed(1));
}

// start按钮用来还原的事件处理
function clearHandler() {
    setBlocksPosition();
    resetGame(false)
    clearTimeout(globalVar.timing);
    fadeToggle($(".name"), "Puzzle Game");
}

// 设置拼图块儿的位置，若提供position_order则按照此顺序排序，否则按照正确顺序排序
function setBlocksPosition(position_order) {
    _.forEach(globalVar.$blocks, function (block, i) {
        var block_classname = $(block).attr("class");
        var pos = getCorrectPositionByClassName(block_classname);
        moveTo($(block), position_order ? position_order[i] : pos)
    })
}

// 根据类名获取该拼图块儿的正确位置
function getCorrectPositionByClassName(classname) {
    var pos = {};
    var reg_block = /block-(\d+)/;
    var order_num = reg_block.exec(classname)[1];
    pos.row = getRowByOrderNumber(order_num);
    pos.col = getColByOrderNumber(order_num);
    return pos;
}

// 随机生成拼图
function randomBlocks() {
    var order = [];
    _.times(globalVar.level * globalVar.level, function (i) {
        order[i] = {row: getRowByOrderNumber(i), col: getColByOrderNumber(i)};
    })
    do {
        order = _.shuffle(order);
    } while(!solvable(order));
    setBlocksPosition(order);
    return order[globalVar.level * globalVar.level - 1];
}

// 逆序数判断order顺序是否可解
function solvable(order) {
    var x, map = [], less = [], size = globalVar.level * globalVar.level - 1;;
    for (var i = 0; i < order.length; ++i)
        map[order[i].row * globalVar.level + order[i].col] = i + 1;
    _.times(order.length, function(i) {
        less[i] = _.filter(_.slice(map, i + 1), function (x) { return x < map[i]; }).length;
    });
    if (order[size].row % 2 == 0) x = order[size].col % 2 == 0 ? 0 : 1;
    else x = order[size].col % 2 == 0 ? 1 : 0;
    return (_.reduce(less, _.add) + x) % 2 == 0;
}

// 游戏计时器
function gameTiming() {
    globalVar.time += 0.1;
    globalVar.$time_screen.val(globalVar.time.toFixed(1));
    globalVar.timing = setTimeout(gameTiming, 100);
}

// image按钮的点击事件
function imgEvent() {
    if (globalVar.start) return;

    var old_img = globalVar.img;
    globalVar.img = globalVar.img + 1 === 3 ? 0 : globalVar.img + 1;

    _.forEach(globalVar.$blocks, function (block) {
        $(block).removeClass("img-" + old_img).addClass("img-" + globalVar.img);
    });
}

$(function () {
    init_global();
    prepareBlock();
    prepareButton();
});
