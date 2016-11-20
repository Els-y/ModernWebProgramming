function checkUsername() {
  var username = $(this).val();
  var reg = /^[a-zA-Z][0-9a-zA-Z_]{5,17}$/;
  var reg_alp = /^[a-zA-Z]/;

  if (username === '') {
    addWarning($(this), "Username can't be empty");
  } else if (!reg_alp.test(username)) {
    addWarning($(this), "Username must start with letter");
  } else if (username.length < 6 || username.length > 18) {
    addWarning($(this), "Length must be between 6 and 18");
  } else if (!reg.test(username)) {
    addWarning($(this), "Username is not valid");
  } else {
    removeWarning($(this));
  }
}

function checkPassword() {
  var password = $(this).val();
  var reg = /^[0-9a-zA-Z\-_]{6,12}$/;

  if (password === '') {
    addWarning($(this), "Password can't be empty");
  } else if (password.length < 6 || password.length > 12) {
    addWarning($(this), "Length must be between 6 and 12");
  } else if (!reg.test(password)) {
    addWarning($(this), "Password is not valid");
  } else {
    removeWarning($(this));
  }
}

function addWarning($input, warning) {
  $input.parents(".form-group").addClass("has-warning");

  $input.siblings().text(warning);
}

function removeWarning($input) {
  $input.parents(".form-group").removeClass("has-warning")
      .find(".text-warning").html("&nbsp;");
}

function submitCheckValid() {
  $(":input").blur();
  if ($(".form-group").hasClass("has-warning"))
    return false;
  else
    return true;
}

function resetEvent() {
  $(".form-group").removeClass("has-warning").find(".text-warning").html("&nbsp;");
   return true;
}

function closeEvent() {
  $(this).parent().remove();
}

$(function () {
  $(':input[name=username]').blur(checkUsername).keyup(checkUsername);
  $(':input[name=password]').blur(checkPassword).keyup(checkPassword);
  $(".close").click(closeEvent);
  $('.reset').click(resetEvent);
  $('.submit').click(submitCheckValid);
});
