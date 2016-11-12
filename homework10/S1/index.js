(function() {
  var xhr;

  $(function() {
    $(".button").click(btnHandler);
    $("#info-bar").addClass("answer-disabled").click(calcHandler);
    $("#at-plus-container").mouseleave(resetGame);
  });

  function btnHandler() {
    var $this = $(this);
    if (!$this.hasClass("button-disabled") &&
      !$this.find(".num").hasClass("waiting")) {
      $this.find(".num").text("。。。").addClass("num-display waiting");
      $this.siblings().not(".hasnum").addClass("button-disabled")
           .find(".tag").addClass("tag-disabled");
      ajaxGet($this);
    }
  }

  function ajaxGet($this) {
    xhr = $.get("/" + new Date().getTime(), null, function(data, textStatus) {
      var $notHasnum = $this.siblings().not(".hasnum");
      $this.addClass("button-disabled hasnum")
           .find(".tag").addClass("tag-disabled")
           .next().text(data).removeClass("waiting");
      $notHasnum.removeClass("button-disabled")
                .find(".tag").removeClass("tag-disabled");
      if ($notHasnum.length === 0)
        $("#info-bar").removeClass("answer-disabled");
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
    if (xhr && xhr.readyState !== 4) xhr.abort();
    $(".button").removeClass("button-disabled hasnum")
                .find(".tag").removeClass("tag-disabled")
                .next().removeClass("waiting");
    $(".num").text("").removeClass("num-display");
    $("#info-bar").addClass("answer-disabled");
    $(".answer").text("").removeClass("answer-display");
  }
})();