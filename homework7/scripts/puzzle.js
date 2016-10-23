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

function addEventLoad(func) {
    var oldevent = window.onload;
    if (typeof oldevent !== 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            oldevent();
            func();
        }
    }
}

function hasClass(elem, classname) {
    return elem.className.indexOf(classname) !== -1;
}

function addClass(elem, classname) {
    if (elem.className == "") {
        elem.className = classname;
    } else if (!hasClass(elem, classname)) {
        if (elem.className.slice(-1) !== " ") elem.className += " ";
        elem.className += classname;
    }
}

function removeClass(elem, classname) {
    if (hasClass(elem, classname)) {
        var reg = new RegExp('(\\s*)' + classname + '(\\s*)');
        elem.className = elem.className.replace(reg, ' ');
    }
}

function init_global() {
    globalVar.start = false;
    globalVar.level = 4;
    globalVar.img = 0;
    globalVar.empty_pos = {row: undefined, col: undefined},
    globalVar.blocks = document.getElementsByClassName("block");
    globalVar.level_btn = document.getElementsByClassName("btn-level")[0];
    globalVar.start_btn = document.getElementsByClassName("btn-start")[0];
    globalVar.img_btn = document.getElementsByClassName("btn-img")[0];
    globalVar.step_screen = document.getElementsByClassName("step-screen")[0];
    globalVar.time_screen = document.getElementsByClassName("time-screen")[0];
}

function prepareBlock() {
    var block, size;
    var puzzle = document.getElementsByClassName("puzzle")[0];
    var fragment = document.createDocumentFragment();

    size = globalVar.level * globalVar.level - 1;

    for (var i = 0; i < size; ++i) {
        block = document.createElement("div");
        block.className = "block level-" + globalVar.level +
                                          " level-" + globalVar.level + "-block-" + i +
                                          " img-"+ globalVar.img + 
                                          " level-" + globalVar.level + "-row-" + Math.floor(i / globalVar.level) +
                                          " level-" + globalVar.level + "-col-" + (i % globalVar.level);
        block.onclick = blockEvent;
        fragment.appendChild(block);
    }

    puzzle.appendChild(fragment);
}

function blockEvent() {
    var name = document.getElementsByClassName("name")[0];

    if (globalVar.start) {
        var pos = getPostion(this);
        if (adjacentEmpty(pos)) {
            moveTo(this, globalVar.empty_pos);
            
            globalVar.empty_pos.row = pos.row;
            globalVar.empty_pos.col = pos.col;
            globalVar.step = globalVar.step + 1;
            globalVar.step_screen.value = globalVar.step;

            if (ifcomplete()) {
                globalVar.start = false;
                globalVar.start_btn.innerHTML = "Start";
                clearTimeout(globalVar.timing);
                
                removeClass(globalVar.level_btn, "btn-disabled");
                removeClass(globalVar.img_btn, "btn-disabled");
                removeClass(globalVar.start_btn, "btn-clear");
                addClass(globalVar.start_btn, "btn-start");

                fadeToggle(name, "Congratulations");
            }
        }
    }
}

function getPostion(elem) {
    var pos = {};
    var e_classname = elem.className;
    var reg_row = new RegExp("level-" + globalVar.level + "-row-(\\d+)");
    var reg_col = new RegExp("level-" + globalVar.level + "-col-(\\d+)");

    pos.row = parseInt(reg_row.exec(e_classname)[1]);
    pos.col = parseInt(reg_col.exec(e_classname)[1]);

    return pos;
}

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

function moveTo(elem, position) {
    var pos = getPostion(elem);

    removeClass(elem, "level-" + globalVar.level + "-row-" + pos.row);
    removeClass(elem, "level-" + globalVar.level + "-col-" + pos.col);

    addClass(elem, "level-" + globalVar.level + "-row-" + position.row);
    addClass(elem, "level-" + globalVar.level + "-col-" + position.col);
}

function ifcomplete() {
    var blocks_length = globalVar.blocks.length;
    var reg_block = /block-(\d+)/;
    var block_num, pos;

    if (globalVar.empty_pos.row !== globalVar.level - 1 || globalVar.empty_pos.col !== globalVar.level - 1)
        return false;

    for (var i = 0; i < blocks_length; ++i) {
        pos = getPostion(globalVar.blocks[i]);
        block_num = parseInt(reg_block.exec(globalVar.blocks[i].className)[1]);
        if (Math.floor(block_num / globalVar.level) !== pos.row || block_num % globalVar.level !== pos.col)
            return false;
    }

    return true;
}

function fadeToggle(elem, value, fadeIn) {
    fadeIn = fadeIn || false;

    if (fadeIn === false) {
        addClass(elem, "hidden");
        setTimeout(function () { fadeToggle(elem, value, true) }, 250);
    } else {
        elem.innerHTML = value;
        removeClass(elem, "hidden");
    }
}

function prepareButton() {
    globalVar.level_btn.onclick = levelEvent;
    globalVar.start_btn.onclick = startEvent;
    globalVar.img_btn.onclick = imgEvent;
}

function levelEvent() {
    if (globalVar.start) return;

    var puzzle = document.getElementsByClassName("puzzle")[0];
    var level_name = ["Easy", "Medium", "Hard"];
    globalVar.level = globalVar.level + 1 === 6 ? 3 : globalVar.level + 1;

    this.innerHTML = level_name[globalVar.level - 3];
    while (puzzle.firstChild)
        puzzle.removeChild(puzzle.firstChild)

    prepareBlock();
}

function startEvent() {
    if (globalVar.start) {
        clearHandler();
        this.innerHTML = "Start";
        removeClass(this, "btn-clear");
        addClass(this, "btn-start");
    } else {
        startHandler();
        this.innerHTML = "Clear";
        removeClass(this, "btn-start");
        addClass(this, "btn-clear");
    }
}

function startHandler() {
    var empty_pos;
    var name = document.getElementsByClassName("name")[0];

    globalVar.start = true;
    globalVar.step = 0;
    globalVar.time = 0;
    globalVar.step_screen.value = 0;
    globalVar.time_screen.value = globalVar.time.toFixed(1);

    addClass(globalVar.level_btn, "btn-disabled");
    addClass(globalVar.img_btn, "btn-disabled")

    empty_pos = randomBlocks();
    globalVar.empty_pos.row = empty_pos.row;
    globalVar.empty_pos.col = empty_pos.col;
    globalVar.timing = setTimeout(gameTiming, 100);

    fadeToggle(name, "Playing");
}

function clearHandler() {
    var block_num, block_classname;
    var blocks_length = globalVar.blocks.length;
    var name = document.getElementsByClassName("name")[0];
    var reg_block = /block-(\d+)/;
    var reg_row = new RegExp("level-" + globalVar.level + "-row-(\\d+)");
    var reg_col = new RegExp("level-" + globalVar.level + "-col-(\\d+)");

    for (var i = 0; i < blocks_length; ++i) {
        block_num = reg_block.exec(globalVar.blocks[i].className)[1];
        block_classname = globalVar.blocks[i].className;
        removeClass(globalVar.blocks[i], reg_row.exec(block_classname)[0]);
        removeClass(globalVar.blocks[i], reg_col.exec(block_classname)[0]);
        addClass(globalVar.blocks[i], "level-" + globalVar.level + "-row-" + Math.floor(block_num / globalVar.level));
        addClass(globalVar.blocks[i], "level-" + globalVar.level + "-col-" + (block_num % globalVar.level));
    }

    globalVar.start = false;
    globalVar.time = 0;
    globalVar.step_screen.value = 0;
    globalVar.time_screen.value = globalVar.time.toFixed(1);

    clearTimeout(globalVar.timing);
    removeClass(globalVar.level_btn, "btn-disabled");
    removeClass(globalVar.img_btn, "btn-disabled");
    fadeToggle(name, "Puzzle Game");
}

function randomBlocks() {
    var block_classname, size;
    var order = [];
    var blocks_length = globalVar.blocks.length;
    var reg_row = new RegExp("level-" + globalVar.level + "-row-(\\d+)");
    var reg_col = new RegExp("level-" + globalVar.level + "-col-(\\d+)");
    size = globalVar.level * globalVar.level;

    for (var i = 0; i < size; ++i)
        order[i] = {row: Math.floor(i / globalVar.level), col: i % globalVar.level};
    
    do {
        order.sort(function () {
            return 0.5 - Math.random();
        });
    } while(!solvable(order));

    for (var i = 0; i < blocks_length; ++i) {
        block_classname = globalVar.blocks[i].className;
        removeClass(globalVar.blocks[i], reg_row.exec(block_classname)[0]);
        removeClass(globalVar.blocks[i], reg_col.exec(block_classname)[0]);
        addClass(globalVar.blocks[i], "level-" + globalVar.level + "-row-" + order[i].row);
        addClass(globalVar.blocks[i], "level-" + globalVar.level + "-col-" + order[i].col);
    }

    return order[size - 1];
}

function solvable(order) {
    var order_length = order.length;
    var map = [], less = [];
    var x, sum, size;

    size = globalVar.level * globalVar.level - 1;
    
    for (var i = 0; i < order_length; ++i)
        map[order[i].row * globalVar.level + order[i].col] = i + 1;

    for (var i = 0; i < order_length; ++i) {
        less[i] = 0;
        for (var j = i + 1; j < order_length; ++j)
            if (map[j] < map[i]) less[i]++;
    }

    if (order[size].row % 2 == 0) {
        x = order[size].col % 2 == 0 ? 0 : 1;
    } else {
        x = order[size].col % 2 == 0 ? 1 : 0;
    }

    sum = less.reduce(function (a, b) { return a + b; }) + x;

    return sum % 2 == 0;
}

function gameTiming() {
    globalVar.time += 0.1;
    globalVar.time_screen.value = globalVar.time.toFixed(1);
    globalVar.timing = setTimeout(gameTiming, 100);
}

function imgEvent() {
    if (globalVar.start) return;

    var blocks_length = globalVar.blocks.length;
    var old_img = globalVar.img;

    globalVar.img = globalVar.img + 1 === 3 ? 0 : globalVar.img + 1;

    for (var i = 0; i < blocks_length; ++i) {
        removeClass(globalVar.blocks[i], "img-" + old_img);
        addClass(globalVar.blocks[i], "img-" + globalVar.img);
    }
}

addEventLoad(init_global);
addEventLoad(prepareBlock);
addEventLoad(prepareButton);