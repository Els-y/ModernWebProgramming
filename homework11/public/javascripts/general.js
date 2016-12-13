// general
(function() {
  $(function() {
    $('.close').click(closeEvent);
  });

  function closeEvent() {
    $(this).parent().remove();
  }
})();

// login
(function() {
  $(function () {
    $('.login-form :input[name=username]').blur(checkUsername).keyup(checkUsername);
    $('.login-form :input[name=password]').blur(checkPassword).keyup(checkPassword);
    $('.login-form .reset').click(resetEvent);
    $('.login-form .submit').click(submitCheckValid);
  });

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
    var $password = $(".login-form :input[name=password]");
    $(".login-form :input").blur();
    if ($(".login-form .form-group").hasClass("has-warning")) {
      return false;
    } else {
      $password.val(encryptPassword($password.val()));
      return true;
    }
  }

  function resetEvent() {
    $(".login-form .form-group").removeClass("has-warning").find(".text-warning").html("&nbsp;");
    return true;
  }

  function encryptPassword(password) {
    var key = CryptoJS.enc.Utf8.parse($(':input[name=_token]').val().slice(7, 23));

    var encryptedData = CryptoJS.AES.encrypt(password, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });

    return encryptedData.ciphertext.toString();
  }
})();

// regist
(function() {
  $(function () {
    $('.regist-form :input[name=username]').blur(checkUsername).keyup(checkUsername);
    $('.regist-form :input[name=password]').blur(checkPassword).keyup(checkPassword);
    $('.regist-form :input[name=confirm]').blur(checkConfirm).keyup(checkConfirm);
    $('.regist-form :input[name=stuID]').blur(checkStuID).keyup(checkStuID);
    $('.regist-form :input[name=phone]').blur(checkPhone).keyup(checkPhone);
    $('.regist-form :input[name=email]').blur(checkEmail).keyup(checkEmail);
    $('.regist-form .reset').click(resetEvent);
    $('.regist-form .submit').click(submitCheckValid);
  });

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
      checkIfExist($(this), {key: "username", value: username});
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

  function checkConfirm() {
    var confirm = $(this).val();
    var reg = /^[0-9a-zA-Z\-_]{6,12}$/;

    if (confirm === '') {
      addWarning($(this), "Confirm password can't be empty");
    } else if (confirm.length < 6 || confirm.length > 12) {
      addWarning($(this), "Length must be between 6 and 12");
    } else if (!reg.test(confirm)) {
      addWarning($(this), "Confirm password is not valid");
    } else if (confirm !== $(":input[name=password]").val()) {
      addWarning($(this), "Passwords are not consistent");
    } else {
      removeWarning($(this));
    }
  }

  function checkStuID() {
    var stuID = $(this).val();
    var reg = /^[1-9]\d{7}$/;
    var reg_num = /[^\d]/;

    if (stuID === '') {
      addWarning($(this), "Student Number can't be empty");
    } else if (stuID[0] === '0') {
      addWarning($(this), "Student Number can not start with 0");
    } else if (reg_num.test(stuID)) {
      addWarning($(this), "Student Number must be number");
    } else if (stuID.length !== 8) {
      addWarning($(this), "Student Number length must be 8");
    } else if (!reg.test(stuID)) {
      addWarning($(this), "Student Number is not valid");
    } else {
      checkIfExist($(this), {key: "stuID", value: stuID});
    }
  }

  function checkPhone() {
    var phone = $(this).val();
    var reg = /^[1-9]\d{10}$/;
    var reg_num = /[^\d]/;

    if (phone === '') {
      addWarning($(this), "Mobile phone can't be empty");
    } else if (phone[0] === '0') {
      addWarning($(this), "Mobile phone can not start with 0");
    } else if (reg_num.test(phone)) {
      addWarning($(this), "Mobile phone must be number");
    } else if (phone.length !== 11) {
      addWarning($(this), "Mobile phone length must be 11");
    } else if (!reg.test(phone)) {
      addWarning($(this), "Mobile phone is not valid");
    } else {
      checkIfExist($(this), {key: "phone", value: phone});
    }
  }

  function checkEmail() {
    var email = $(this).val();
    // var reg = /^[a-zA-Z_\-]+@(([a-zA-Z_\-]+\.)+[a-zA-Z]{2,4})$/;
    var reg = /^\w+([-+.]\w+)*@(([0-9a-zA-Z_\-]+\.)+[a-zA-Z]{2,4})$/;
    var $input_group = $(this).parents('.input-group');

    if (email === '') {
      addWarning($(this), "Email can't be empty");
    } else if (!reg.test(email)) {
      addWarning($(this), "Email is not valid");
    } else {
      checkIfExist($(this), {key: "email", value: email});
    }
  }

  function addWarning($input, warning) {
    $input.parents(".regist-form .form-group").addClass("has-warning");
    $input.siblings().text(warning);
  }

  function removeWarning($input) {
    $input.parents(".regist-form .form-group").removeClass("has-warning")
    .find(".text-warning").html("&nbsp;");
  }

  function checkIfExist($input, valueObject) {
    $.post("/checkexist", valueObject, function(data, textStatus) {
      if (data.success) {
        removeWarning($input);
      } else {
        addWarning($input, data.message);
      }
    });
  }

  function encryptPassword(password) {
    var key = CryptoJS.enc.Utf8.parse($(':input[name=_token]').val().slice(7, 23));

    var encryptedData = CryptoJS.AES.encrypt(password, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });

    return encryptedData.ciphertext.toString();
  }

  function submitCheckValid() {
    var $password = $('.regist-form :input[name=password]');
    $(".regist-form :input").blur();
    if ($(".form-group").hasClass("has-warning")) {
      return false;
    } else {
      $password.val(encryptPassword($password.val()));
      return true;
    }
  }

  function resetEvent() {
    $(".regist-form .form-group").removeClass("has-warning").find(".text-warning").html("&nbsp;");
    return true;
  }
})();
