(function() {
  $(function() {
    var game = {start: false, xhr: null};
    $(".button").click(btnHandler.bind(game)());
    $("#info-bar").addClass("answer-disabled").click(calcHandler);
    $("#at-plus-container").mouseleave(resetGame.bind(game));
    $(".apb").click(runGame.bind(game));
  });

  function btnHandler() {
    var that = this;
    return function() {
      if (!$(this).hasClass("button-disabled") && !$(this).find(".num").hasClass("waiting")) {
        btnLoading($(this));
        ajaxGet.call(that, $(this));
      }
    }
  }

  function btnLoading($btn) {
    $btn.find(".num").text("。。。").addClass("num-display waiting");
    $btn.siblings().not(".hasnum").addClass("button-disabled")
        .find(".tag").addClass("tag-disabled");
  }

  function ajaxGet($this) {
    this.xhr = $.get("/" + new Date().getTime(), null, function(data, textStatus) {
      var $notHasnum = $this.siblings().not(".hasnum");
      $this.addClass("button-disabled hasnum")
                 .find(".tag").addClass("tag-disabled")
                 .next().text(data).removeClass("waiting");
      $notHasnum.removeClass("button-disabled")
            .find(".tag").removeClass("tag-disabled");
      if ($notHasnum.length === 0) {
        $("#info-bar").removeClass("answer-disabled");
      }
    });
  }

  function calcHandler() {
    if (!$(this).hasClass("answer-disabled")) {
      var ans = 0;
      $("#control-ring").find(".num").each(function(index, num) {
        ans += parseInt($(num).text());
      });
      $(".answer").html(ans).addClass("answer-display");
      $(this).addClass("answer-disabled");
    }
  }

  function resetGame() {
    this.start = false;
    if (this.xhr && this.xhr.readyState !== 4) this.xhr.abort();
    $(".button").removeClass("button-disabled hasnum")
                .find(".tag").removeClass("tag-disabled")
                .next().removeClass("waiting");
    $(".num").text("").removeClass("num-display");
    $("#info-bar").addClass("answer-disabled");
    $(".answer").text("").removeClass("answer-display");
  }

  function runGame() {
    if (!this.start && (!this.xhr || this.xhr.readyState === 0 || this.xhr.readyState === 4)) {
      this.start = true;
      robotBtnClick.call(this, $(".button").not(".hasnum").first());
    }
  }

  function robotBtnClick($btn) {
    if ($btn.hasClass("hasnum")) {
      if ($btn.next().length !== 0)
        robotBtnClick($btn.next());
      return;
    }
    btnLoading($btn);
    robotAjaxHandler.call(this, $btn);
  }

  function robotAjaxHandler($btn) {
    var that = this;
    this.xhr = $.get("/" + new Date().getTime(), null, function(data, textStatus) {
      var $notHasnum = $btn.siblings().not(".hasnum");
      $btn.addClass("button-disabled hasnum")
          .find(".tag").addClass("tag-disabled")
          .next().text(data).removeClass("waiting");
      $notHasnum.removeClass("button-disabled")
                .find(".tag").removeClass("tag-disabled");
      if ($notHasnum.length === 0)
        $("#info-bar").removeClass("answer-disabled").click();
      if ($btn.next().length !== 0)
        robotBtnClick.call(that, $btn.next());
    });
  }
})();