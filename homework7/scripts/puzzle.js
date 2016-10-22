var globalVar = {
    start: false,
    empty_pos: {row: 3, col: 3},
    step: 0,
    time: 0,
    timing: undefined
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
        elem.className = elem.className + " " + classname;
    }
}

function removeClass(elem, classname) {
    if (hasClass(elem, classname)) {
        var reg = new RegExp('(\\s*)' + classname + '(\\s*)');
        elem.className = elem.className.replace(reg, ' ');
    }
}

function init_global() {
    globalVar.blocks = document.getElementsByClassName("block");
    globalVar.start_btn = document.getElementsByClassName("btn-start")[0];
    globalVar.clear_btn = document.getElementsByClassName("btn-clear")[0];
    globalVar.img_btn = document.getElementsByClassName("btn-img")[0];
    globalVar.step_screen = document.getElementsByClassName("step-screen")[0];
    globalVar.time_screen = document.getElementsByClassName("time-screen")[0];
}

function prepareBlock() {
    var block;
    var puzzle = document.getElementsByClassName("puzzle")[0];

    var fragment = document.createDocumentFragment();

    for (var i = 0; i < 15; ++i) {
        block = document.createElement("div");
        block.className = "block block-" + i + " img-0" + 
                                          " row-" + Math.floor(i / 4) + " col-" + (i % 4);
        block.onclick = blockEvent;
        fragment.appendChild(block);
    }

    puzzle.appendChild(fragment);
}

function blockEvent() {
    var empty_pos = globalVar.empty_pos;
    var name = document.getElementsByClassName("name")[0];

    if (globalVar.start) {
        var pos = getPostion(this);
        if (adjacentEmpty(pos)) {
            moveTo(this, empty_pos);
            
            globalVar.empty_pos.row = pos.row;
            globalVar.empty_pos.col = pos.col;
            globalVar.step = globalVar.step + 1;
            globalVar.step_screen.value = globalVar.step;

            if (ifcomplete()) {
                globalVar.start = false;
                clearTimeout(globalVar.timing);
                removeClass(globalVar.start_btn, "btn-disabled");
                removeClass(globalVar.img_btn, "btn-disabled");
                addClass(globalVar.clear_btn, "btn-disabled");
                fadeToggle(name, "Congratulations");
            }
        }
    }
}

function getPostion(elem) {
    var pos = {};
    var e_classname = elem.className;
    var reg_row = /row-(\d+)/;
    var reg_col = /col-(\d+)/;

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
    removeClass(elem, "row-" + pos.row);
    removeClass(elem, "col-" + pos.col);

    addClass(elem, "row-" + position.row);
    addClass(elem, "col-" + position.col);
}

function ifcomplete() {
    var blocks_length = globalVar.blocks.length;
    var reg_block = /block-(\d+)/;
    var block_num, pos;

    if (globalVar.empty_pos.row !== 3 || globalVar.empty_pos.col !== 3)
        return false;

    for (var i = 0; i < blocks_length; ++i) {
        pos = getPostion(globalVar.blocks[i]);
        block_num = parseInt(reg_block.exec(globalVar.blocks[i].className)[1]);
        if (Math.floor(block_num / 4) !== pos.row || block_num % 4 !== pos.col)
            return false;
    }

    return true;
}

function prepareButton() {
    globalVar.start_btn.onclick = startEvent;
    globalVar.clear_btn.onclick = clearEvent;
    globalVar.img_btn.onclick = imgEvent;

    addClass(globalVar.clear_btn, "btn-disabled");
}

function startEvent() {
    var empty_pos;
    var name = document.getElementsByClassName("name")[0];

    if (globalVar.start == false) {
        globalVar.start = true;
        globalVar.step = 0;
        globalVar.time = 0;
        globalVar.step_screen.value = 0;
        globalVar.time_screen.value = globalVar.time.toFixed(1);

        addClass(this, "btn-disabled");
        addClass(globalVar.img_btn, "btn-disabled")
        removeClass(globalVar.clear_btn, "btn-disabled");

        empty_pos = randomBlocks();
        globalVar.empty_pos.row = empty_pos.row;
        globalVar.empty_pos.col = empty_pos.col;
        globalVar.timing = setTimeout(gameTiming, 100);

        fadeToggle(name, "Playing");
    }
}

function randomBlocks() {
    var block_classname;
    var order = [];
    var blocks_length = globalVar.blocks.length;
    var reg_row = /row-(\d+)/;
    var reg_col = /col-(\d+)/;

    for (var i = 0; i < 16; ++i)
        order[i] = {row: Math.floor(i / 4), col: i % 4};
    
    do {
        order.sort(function () {
            return 0.5 - Math.random();
        });
    } while(!solvable(order));

    for (var i = 0; i < blocks_length; ++i) {
        block_classname = globalVar.blocks[i].className;
        removeClass(globalVar.blocks[i], reg_row.exec(block_classname)[0]);
        removeClass(globalVar.blocks[i], reg_col.exec(block_classname)[0]);
        addClass(globalVar.blocks[i], "row-" + order[i].row);
        addClass(globalVar.blocks[i], "col-" + order[i].col);
    }

    return order[15];
}

function gameTiming() {
    globalVar.time += 0.1;
    globalVar.time_screen.value = globalVar.time.toFixed(1);
    globalVar.timing = setTimeout(gameTiming, 100);
}

function clearEvent() {
    if (!globalVar.start) return;

    var block_num, block_classname;
    var blocks_length = globalVar.blocks.length;
    var name = document.getElementsByClassName("name")[0];
    var reg_block = /block-(\d+)/;
    var reg_row = /row-(\d+)/;
    var reg_col = /col-(\d+)/;

    for (var i = 0; i < blocks_length; ++i) {
        block_num = reg_block.exec(globalVar.blocks[i].className)[1];
        block_classname = globalVar.blocks[i].className;
        removeClass(globalVar.blocks[i], reg_row.exec(block_classname)[0]);
        removeClass(globalVar.blocks[i], reg_col.exec(block_classname)[0]);
        addClass(globalVar.blocks[i], "row-" + Math.floor(block_num / 4));
        addClass(globalVar.blocks[i], "col-" + (block_num % 4));
    }

    globalVar.start = false;
    globalVar.time = 0;
    globalVar.step_screen.value = 0;
    globalVar.time_screen.value = globalVar.time.toFixed(1);
    clearTimeout(globalVar.timing);
    removeClass(globalVar.start_btn, "btn-disabled");
    removeClass(globalVar.img_btn, "btn-disabled");
    addClass(globalVar.clear_btn, "btn-disabled");
    fadeToggle(name, "Puzzle Game");
}

function imgEvent() {
    if (globalVar.start) return;

    var blocks_length = globalVar.blocks.length;
    var reg_img = /img-(\d+)/;
    var pic_info = reg_img.exec(globalVar.blocks[0].className);
    var pic_new = parseInt(pic_info[1]) + 1 == 3 ? 0 : parseInt(pic_info[1]) + 1;

    for (var i = 0; i < blocks_length; ++i) {
        removeClass(globalVar.blocks[i], pic_info[0]);
        addClass(globalVar.blocks[i], "img-" + pic_new);
    }
}

function solvable(order) {
    var order_length = order.length;
    var map = [], less = [];
    var x, sum;
    
    for (var i = 0; i < order_length; ++i)
        map[order[i].row * 4 + order[i].col] = i + 1;
    
    console.log(map);

    for (var i = 0; i < order_length; ++i) {
        less[i] = 0;
        for (var j = i + 1; j < order_length; ++j)
            if (map[j] < map[i]) less[i]++;
    }

    if (order[15].row % 2 == 0) {
        x = order[15].col % 2 == 0 ? 0 : 1;
    } else {
        x = order[15].col % 2 == 0 ? 1 : 0;
    }

    sum = less.reduce(function (a, b) { return a + b; }) + x;

    return sum % 2 == 0;
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

addEventLoad(init_global);
addEventLoad(prepareBlock);
addEventLoad(prepareButton);

// function calcValue() {
//     var map = [];
//     var less = [];
//     var sum, x, pos;

//     for (var i = 0; i < globalVar.blocks.length; ++i) {
//         pos = getPostion(globalVar.blocks[i]);
//         map[pos.row * 4 + pos.col] = i + 1;
//     }

//     if (map.length == 16) {
//         for (var i = 0; i < map.length; ++i) {
//             if (map[i] === undefined) {
//                 map[i] = 16;
//                 if (Math.floor(i / 4) % 2 == 0) {
//                     x = (i % 4) % 2 == 0 ? 0 : 1;
//                 } else {
//                     x = (i % 4) % 2 == 0 ? 1 : 0;
//                 }
//                 break;
//             }
//         }
//     } else {
//         map[15] = 16;
//         x = 0;
//     }

//     for (var i = 0; i < map.length; ++i) {
//         less[i] = 0;
//         for (var j = i + 1; j < map.length; ++j)
//             if (map[j] < map[i]) less[i]++;
//     }

//     sum = less.reduce(function (a, b) { return a + b; }) + x;

//     console.log(sum);
// }