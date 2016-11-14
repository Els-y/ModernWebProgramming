function checkUsername() {
    var username = $(this).val();
    var reg = /^[a-zA-Z][0-9a-zA-Z_]{5,17}$/;

    if (username === '') {
        addWarning($(this), "Username can't be empty");
    } else if (!reg.test(username)) {
        addWarning($(this), "Username is not valid");
    } else {
        checkIfExist($(this), {key: "username", value: username});
    }
}

function checkStuID() {
    var stuID = $(this).val();
    var reg = /^[1-9]\d{7}$/;

    if (stuID === '') {
        addWarning($(this), "Student Number can't be empty");
    } else if (!reg.test(stuID)) {
        addWarning($(this), "Student Number is not valid");
    } else {
        checkIfExist($(this), {key: "stuID", value: stuID});
    }
}

function checkPhone() {
    var phone = $(this).val();
    var reg = /^[1-9]\d{10}$/;
    
    if (phone === '') {
        addWarning($(this), "Mobile phone can't be empty");
    } else if (!reg.test(phone)) {
        addWarning($(this), "Mobile phone is not valid");
    } else {
        checkIfExist($(this), {key: "phone", value: phone});
    }
}

function checkEmail() {
    var email = $(this).val();
    var reg = /^[a-zA-Z_\-]+@(([a-zA-Z_\-]+\.)+[a-zA-Z]{2,4})$/;
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
    $input.parents(".form-group").addClass("has-warning");

    $input.siblings().text(warning);
}

function removeWarning($input) {
    $input.parents(".form-group").removeClass("has-warning")
          .find(".text-warning").html("&nbsp;");
}

function checkIfExist($input, valueObject) {
    $.post("/checkexist", valueObject, function(data, textStatus) {
        if (data.toString() === "passed")
            removeWarning($input);
        else
            addWarning($input, data.toString());
    });
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

$(function () {
    $(':input[name=username]').blur(checkUsername).keyup(checkUsername);
    $(':input[name=stuID]').blur(checkStuID).keyup(checkStuID);
    $(':input[name=phone]').blur(checkPhone).keyup(checkPhone);
    $(':input[name=email]').blur(checkEmail).keyup(checkEmail);
    $('.reset').click(resetEvent);
    $('.submit').click(submitCheckValid);
});
