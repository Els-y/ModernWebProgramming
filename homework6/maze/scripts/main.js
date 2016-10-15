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
    var start = false;
    var inside = false;

    var blocks = document.getElementsByClassName('block');
    var wrapper = document.getElementsByClassName("map")[0];
    var startBlock = document.getElementsByClassName("start-wrapper")[0];
    var endHover = document.getElementsByClassName("end-wrapper")[0];
    var info = document.getElementsByClassName("info")[0];

    wrapper.onmouseout = function (event) {
        if (!event) event = window.event;
        var to = event.relatedTarget ? event.relatedTarget : event.toElement;
        if (!this.contains(to)) {
            inside = false;
            clearBlock();
        }
    }
    
    wrapper.onmouseover = function (event) {
        if (!event) event = window.event;
        var from = event.relatedTarget ? event.relatedTarget : event.fromElement;
        if (!this.contains(from)) {
            inside = false;
        }
    }

    var clearBlock = function () {
        for (var i = 0; i < blocks.length; ++i)
            removeClass(blocks[i], "block-hover");
    }

    startBlock.onmouseover = function () {
        clearBlock();
        removeClass(info, "info-display");
        start = true;
        inside = true;
    }

    endHover.onmouseover = function () {
        if (start) {
            if (inside) {
                info.innerHTML = "You Win";
            } else {
                info.innerHTML = "Don't cheat, you should start from the 'S' and move to the 'E' inside the maze!";
            }
            addClass(info, "info-display");
        }
        start = false;
    }

    for (var i = 0; i < blocks.length; ++i) {
        blocks[i].onmouseover = function () {
            if (start) {
                start = false;
                addClass(this, "block-hover");
                addClass(info, "info-display");
                info.innerHTML = "You Lose";
            }
        }
    }
}

addEventLoad(prepareGame);