$(function() {
  var handlerArr = [aHandler(), bHandler(), cHandler(), dHandler(), eHandler()];

  $(".numA").click(handlerArr[0]);
  $(".numB").click(handlerArr[1]);
  $(".numC").click(handlerArr[2]);
  $(".numD").click(handlerArr[3]);
  $(".numE").click(handlerArr[4]);

  $("#info-bar").addClass("answer-disabled").click(bubbleHandler);
  $("#at-plus-container").mouseleave(resetGame);
  $(".apb").click(runGame.bind(handlerArr));
});

function randomError(probability) {
  return _.random(0, 1, true) < probability;
}

function abortAjax() {
  if (this.xhr && this.xhr.readyState !== 4) this.xhr.abort();
}

// obj = {message, currentSum}
function aHandler() {
  var arg = {xhr: null};
  $("#at-plus-container").mouseleave(abortAjax.bind(arg));

  return function(obj, callback) {
    if (!$(this).hasClass("button-disabled") && !$(this).find(".num").hasClass("waiting")) {
      btnLoading($(this));
      if (!("currentSum" in obj)) $(".apb").addClass("active");
      ajaxGet.call(arg, $(this), obj, callback);
    }
  }
}

function bHandler() {
  var arg = {xhr: null};
  $("#at-plus-container").mouseleave(abortAjax.bind(arg));

  return function(obj, callback) {
    if (!$(this).hasClass("button-disabled") && !$(this).find(".num").hasClass("waiting")) {
      btnLoading($(this));
      if (!("currentSum" in obj)) $(".apb").addClass("active");
      ajaxGet.call(arg, $(this), obj, callback);
    }
  }
}

function cHandler() {
  var arg = {xhr: null};
  $("#at-plus-container").mouseleave(abortAjax.bind(arg));

  return function(obj, callback) {
    if (!$(this).hasClass("button-disabled") && !$(this).find(".num").hasClass("waiting")) {
      btnLoading($(this));
      if (!("currentSum" in obj)) $(".apb").addClass("active");
      ajaxGet.call(arg, $(this), obj, callback);
    }
  }
}

function dHandler() {
  var arg = {xhr: null};
  $("#at-plus-container").mouseleave(abortAjax.bind(arg));

  return function(obj, callback) {
    if (!$(this).hasClass("button-disabled") && !$(this).find(".num").hasClass("waiting")) {
      btnLoading($(this));
      if (!("currentSum" in obj)) $(".apb").addClass("active");
      ajaxGet.call(arg, $(this), obj, callback);
    }
  }
}

function eHandler() {
  var arg = {xhr: null};
  $("#at-plus-container").mouseleave(abortAjax.bind(arg));

  return function(obj, callback) {
    if (!$(this).hasClass("button-disabled") && !$(this).find(".num").hasClass("waiting")) {
      btnLoading($(this));
      if (!("currentSum" in obj)) $(".apb").addClass("active");
      ajaxGet.call(arg, $(this), obj, callback);
    }
  }
}

function btnLoading($btn) {
  $btn.find(".num").text("。。。").addClass("num-display waiting");
  $btn.siblings().not(".hasnum").addClass("button-disabled")
      .find(".tag").addClass("tag-disabled");
}

function ajaxGet($btn, obj, callback) {
  var that = this;
  if ("currentSum" in obj) updateAlert(obj.message)
  this.xhr = $.get("/" + new Date().getTime(), null, function(data, textStatus) {
    var ifError = randomError(0.3);
    var nextObj = {message: getAlert($btn, ifError),
                   currentSum: obj.currentSum};

    if (("currentSum" in obj) && ifError) {
      ajaxGet.bind(that)($btn, nextObj, callback);
      return;
    }

    nextObj.currentSum += parseInt(data);
    updateBtnAndSetNum($btn, data)
    if ($(".button").not(".hasnum").length === 0　&& typeof callback !== 'function')
      $("#info-bar").removeClass("answer-disabled");
    if (typeof callback === 'function')
      callback(nextObj);
  });
}

function getAlert($btn, err) {
  var message = {
    A: {true: "这不是个天大的秘密", false: "这是个天大的秘密"},
    B: {true: "我知道", false: "我不知道"},
    C: {true: "你知道", false: "你不知道"},
    D: {true: "他知道", false: "他不知道"},
    E: {true: "不才怪", false: "才怪"},
  };
  var btnNumber = /num(.)/.exec($btn.attr("class"))[1];
  return message[btnNumber][err];
}

function updateAlert(message) {
  $(".alert").text(message);
}

function updateBtnAndSetNum($btn, data) {
    var $notHasnum = $btn.siblings().not(".hasnum");
    $btn.addClass("button-disabled hasnum")
        .find(".tag").addClass("tag-disabled")
        .next().text(data).removeClass("waiting");
    $notHasnum.removeClass("button-disabled")
              .find(".tag").removeClass("tag-disabled");
}

function bubbleHandler(obj, callback) {
  if (!$(this).hasClass("answer-disabled")) {
    var ans = 0;
    if ("currentSum" in obj) {
      updateAlert(obj.message);
      ans = obj.currentSum;
      
      setTimeout(function() {
        updateAlert("楼主异步调用战斗力感人，目测不超过" + ans);
      }, 1500);
    } else {
      $("#control-ring").find(".num").each(function(index, num) {
        ans += parseInt($(num).text());
      });
    }
    $(".answer").html(ans).addClass("answer-display");
    $(this).addClass("answer-disabled");
  }
}

function resetGame() {
  $(".button").removeClass("button-disabled hasnum")
              .find(".tag").removeClass("tag-disabled")
              .next().removeClass("waiting");
  $(".num").text("").removeClass("num-display");
  $("#info-bar").addClass("answer-disabled");
  $(".answer").text("").removeClass("answer-display");
  $(".apb").removeClass("active");
  $(".alert").text("");
  $(".order-info").text("");
}

function runGame() {
  if (!$(".apb").hasClass("active")) {
    $(".apb").addClass("active");
    robotStart(this);
  }
}

function robotStart(handlerArr) {
  var order = getAndShowOrder();
  var btns = $(".button").toArray();
  var callbacks = [];

  for (var i = 0; i < 5; ++i) {
    (function(i) {
      callbacks[i] = function(obj) {
        handlerArr[order[i]].bind(btns[order[i]])(obj, callbacks[i + 1]);
      }
    })(i);
  }
  callbacks.push(bubbleHandler);
  callbacks[0]({message: "", currentSum: 0});
}

function getAndShowOrder() {
  var order = [0, 1, 2, 3, 4];
  var letter_order, mapTable = {"0": "A", "1": "B", "2": "C", "3": "D", "4": "E"};

  order = _.shuffle(order);
  letter_order = _.map(order, function(n) { return mapTable[n]; })
  $(".order-info").text(letter_order.join("、"));

  return order;
}