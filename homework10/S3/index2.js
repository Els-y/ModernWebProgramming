(function() {
  $(function() {
    new Game();
  });
  
  var Game = function() {
    this.initButton();
    this.initApb();
    this.listenButtonsClick();
    this.listenApbClick();
    this.listenCalcClick();
    this.listenReset();
  }
  var p = Game.prototype;

  p.initButton = function() {
    var that = this;
    this.btns = [];
    $(".button").each(function(i, btn) {
      that.btns.push(new Button(btn, i));
    });
  }

  p.listenButtonsClick = function() {
    $('#control-ring').click(function(event) {
      var btn = event.target._btn;
      if(btn) btn.btnClickHandler();
    });
  }

  p.initApb = function() {
    this.apb = new Apb($(".apb").get(0));
  }

  p.listenApbClick = function() {
    $('.apb').click(function(event) {
      var apb = event.target._apb;
      if(apb) apb.apbClickHandler(this);
    }.bind(this));
  }

  p.listenCalcClick = function() {
    $("#info-bar").addClass("answer-disabled").click(function() {
      if (!$(this).hasClass("answer-disabled")) {
        var ans = 0;
        $("#control-ring").find(".num").each(function(index, num) {
          ans += parseInt($(num).text());
        });
        $(".answer").html(ans).addClass("answer-display");
        $(this).addClass("answer-disabled");
      }
    });
  }

  p.listenReset = function() {
    var that = this;
    $("#at-plus-container").mouseleave(function() {
      $.each(that.btns, function(index, btn) {
        btn.abortAjax();
      });
      $(".button").removeClass("button-disabled hasnum")
                  .find(".tag").removeClass("tag-disabled")
                  .next().removeClass("waiting");
      $(".num").text("").removeClass("num-display");
      $("#info-bar").addClass("answer-disabled");
      $(".answer").text("").removeClass("answer-display");
    });
  }

  var Button = function(dom) {
    this.$dom = $(dom);
    this.xhr = null;
    if (dom) {
      dom._btn = this;
      this.$dom.find(".tag").get(0)._btn = this;
    }
  }
  p = Button.prototype;

  p.btnClickHandler = function() {
    if (!this.$dom.hasClass("button-disabled") &&
        !this.$dom.find(".num").hasClass("waiting")) {
      this.btnLoading();
      this.ajaxGet();
    }
  }

  p.btnLoading = function() {
    this.$dom.find(".num").text("。。。").addClass("num-display waiting");
    this.$dom.siblings().not(".hasnum").addClass("button-disabled")
             .find(".tag").addClass("tag-disabled");
  }

  p.ajaxGet = function() {
    var that = this, randomID = new Date().getTime() + Math.random().toFixed(4);
    this.xhr = $.get("/" + randomID, null, function(data, textStatus) {
      var $notHasnum = that.$dom.siblings().not(".hasnum");
      that.$dom.addClass("button-disabled hasnum")
               .find(".tag").addClass("tag-disabled")
               .next().text(data).removeClass("waiting");
      $notHasnum.removeClass("button-disabled")
                .find(".tag").removeClass("tag-disabled");
      if ($notHasnum.length === 0) $("#info-bar").removeClass("answer-disabled").click();
    });
  }

  p.abortAjax = function() {
    if (this.xhr && this.xhr.readyState !== 4) this.xhr.abort();
  }

  p.robotBtnClick = function() {
    if (!this.$dom.hasClass("hasnum")) {
      this.btnLoading();
      this.ajaxGet();            
    }
  }

  var Apb = function(dom) {
    if (dom) dom._apb = this;
  }
  p = Apb.prototype;

  p.apbClickHandler = function(game) {
    if ($(".waiting").length !== 0) return;
    $.each(game.btns, function(index, btn) {
      btn.robotBtnClick();
    });
  }

})();