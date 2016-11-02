var globalVar = {
    start: undefined,
    inside: undefined,
    $blocks: undefined,
}

function init_game() {
    globalVar.start = false;  // 标志游戏是否开始
    globalVar.inside;  // 标志是否一直在maze中，出去
    globalVar.$blocks = $('.block');
}

function startEvent() {
    globalVar.start = true;
    globalVar.inside = true;
    globalVar.$blocks.removeClass("block-hover");
    $(".info").removeClass("info-display");  // 将提示消息隐藏
    $(".map").addClass("map-start");  // 指针变为pointer
}

function endEvent() {
    if (globalVar.start) {
        globalVar.start = false;
        if (globalVar.inside) {
            $(".info").html("You Win").addClass("info-display");;
        } else {
            $(".info").html("Don't cheat, you should start from the 'S' and move to the 'E' inside the maze!")
                            .addClass("info-display");
        }
        $(".map").removeClass("map-start");
    }
}

// 离开地图时触发的事件
function mapLeaveEvent() {
    if (globalVar.start) {
        globalVar.inside = false;
    } else {
        globalVar.$blocks.removeClass("block-hover");
    }
}

function blockEvent() {
    if (globalVar.start) {
        globalVar.start = false;
        $(this).addClass("block-hover");
        $(".info").addClass("info-display").html("You Lose");
        $(".map").removeClass("map-start");
    }
}

$(function () {
    init_game();
    globalVar.$blocks.mouseover(blockEvent);
    $(".map").mouseleave(mapLeaveEvent);
    $(".start-wrapper").mouseover(startEvent);
    $(".end-wrapper").mouseover(endEvent);
});