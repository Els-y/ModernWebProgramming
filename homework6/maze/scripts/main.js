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

function prepareGame() {
    var start = false;  // 标志游戏是否开始
    var inside;  // 标志是否一直在maze中，出去

    var blocks = document.getElementsByClassName('block');
    var wrapper = document.getElementsByClassName("map")[0];
    var startBlock = document.getElementsByClassName("start-wrapper")[0];
    var endHover = document.getElementsByClassName("end-wrapper")[0];
    var info = document.getElementsByClassName("info")[0];
    var map = document.getElementsByClassName("map")[0];

    // 处理从子元素到父元素时触发的onmouseout事件。
    // 若wrapper是子元素的父元素，则什么都不执行；
    // 否则，即跑出了maze，更改inside为false，并把变红的墙壁还原。
    wrapper.onmouseout = function (event) {
        if (!event) event = window.event;
        var to = event.relatedTarget ? event.relatedTarget : event.toElement;
        if (!this.contains(to)) {
            inside = false;
            clearBlock();
        }
    }
    
    // 处理从父元素到子元素时触发的onmouseout事件。
    // 若wrapper是子元素的父元素，则什么都不执行；
    // 否则，即跑出了maze，更改inside为false。
    wrapper.onmouseover = function (event) {
        if (!event) event = window.event;
        var from = event.relatedTarget ? event.relatedTarget : event.fromElement;
        if (!this.contains(from)) {
            inside = false;
        }
    }

    // 把变红的墙壁还原
    var clearBlock = function () {
        for (var i = 0; i < blocks.length; ++i)
            removeClass(blocks[i], "block-hover");
    }

    // 绑定触发游戏开始事件
    startBlock.onmouseover = function () {
        clearBlock();
        removeClass(info, "info-display");  // 将提示消息隐藏
        addClass(map, "map-start");  // 指针变为pointer
        start = true;
        inside = true;
    }

    // 绑定触发游戏结束事件
    endHover.onmouseover = function () {
        if (start) {
            if (inside) {
                info.innerHTML = "You Win";
            } else {
                info.innerHTML = "Don't cheat, you should start from the 'S' and move to the 'E' inside the maze!";
            }
            addClass(info, "info-display");
            removeClass(map, "map-start");
        }
        start = false;
    }

    // 给每个墙壁绑定事件
    for (var i = 0; i < blocks.length; ++i) {
        blocks[i].onmouseover = function () {
            if (start) {
                start = false;
                addClass(this, "block-hover");
                addClass(info, "info-display");
                removeClass(map, "map-start");
                info.innerHTML = "You Lose";
            }
        }
    }
}

addEventLoad(prepareGame);