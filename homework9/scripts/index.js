function checkUsername() {
    var username = $(this).val();
    var reg = /^[a-zA-Z][0-9a-zA-Z_]+$/;
    var $input_group = $(this).parents('.input-group');

    if (username === '') {
        $(this).parents(".form-group").addClass("has-warning");
        if ($input_group.siblings().length === 0)
            $input_group.before('<span class="text-warning">Username can\'t be empty.</span>');
        else
            $input_group.siblings().replaceWith('<span class="text-warning">Username can\'t be empty.</span>');
    } else if (username.length < 6 || username.length > 18 || !reg.test(username)) {
        $(this).parents(".form-group").addClass("has-warning");
        if ($input_group.siblings().length === 0)
            $input_group.before('<span class="text-warning">Username is not valid.</span>');
        else
            $input_group.siblings().replaceWith('<span class="text-warning">Username is not valid.</span>');
    } else {
        $(this).parents(".form-group").removeClass("has-warning")
                   .find('.input-group').siblings().remove();
    }
}

function checkStuID() {
    var stuID = $(this).val();
    var reg = /^[1-9]\d{7}$/;
    var $input_group = $(this).parents('.input-group');

    if (stuID === '') {
        $(this).parents(".form-group").addClass("has-warning");
        if ($input_group.siblings().length === 0)
            $input_group.before('<span class="text-warning">Student Number can\'t be empty.</span>');
        else
            $input_group.siblings().replaceWith('<span class="text-warning">Student Number can\'t be empty.</span>');
    } else if (!reg.test(stuID)) {
        $(this).parents(".form-group").addClass("has-warning");
        if ($input_group.siblings().length === 0)
            $input_group.before('<span class="text-warning">Student Number is not valid.</span>');
        else
            $input_group.siblings().replaceWith('<span class="text-warning">Student Number is not valid.</span>');
    } else {
        $(this).parents(".form-group").removeClass("has-warning")
                   .find('.input-group').siblings().remove();
    }
}

function checkPhone() {
    var phone = $(this).val();
    var reg = /^[1-9]\d{10}$/;
    var $input_group = $(this).parents('.input-group');

    if (phone === '') {
        $(this).parents(".form-group").addClass("has-warning");
        if ($input_group.siblings().length === 0)
            $input_group.before('<span class="text-warning">Mobile phone can\'t be empty.</span>');
        else
            $input_group.siblings().replaceWith('<span class="text-warning">Mobile phone can\'t be empty.</span>');
    } else if (!reg.test(phone)) {
        $(this).parents(".form-group").addClass("has-warning");
        if ($input_group.siblings().length === 0)
            $input_group.before('<span class="text-warning">Mobile phone is not valid.</span>');
        else
            $input_group.siblings().replaceWith('<span class="text-warning">Mobile phone is not valid.</span>');
    } else {
        $(this).parents(".form-group").removeClass("has-warning")
                   .find('.input-group').siblings().remove();
    }
}

function checkEmail() {
    var phone = $(this).val();
    var reg = /^[1-9]\d{10}$/;
    var $input_group = $(this).parents('.input-group');

    if (phone === '') {
        $(this).parents(".form-group").addClass("has-warning");
        if ($input_group.siblings().length === 0)
            $input_group.before('<span class="text-warning">Mobile phone can\'t be empty.</span>');
        else
            $input_group.siblings().replaceWith('<span class="text-warning">Mobile phone can\'t be empty.</span>');
    } else if (!reg.test(phone)) {
        $(this).parents(".form-group").addClass("has-warning");
        if ($input_group.siblings().length === 0)
            $input_group.before('<span class="text-warning">Mobile phone is not valid.</span>');
        else
            $input_group.siblings().replaceWith('<span class="text-warning">Mobile phone is not valid.</span>');
    } else {
        $(this).parents(".form-group").removeClass("has-warning")
                   .find('.input-group').siblings().remove();
    }
}

function checkValid() {
    $(":input").blur();
    if ($(".form-group").hasClass("has-warning"))
        return false;
    else
        return true;
}

function resetEvent() {
    $(".form-group").removeClass("has-warning").find(".input-group").siblings().remove();
     return true;
}

$(function () {
    $(':input[name=username]').blur(checkUsername);
    $(':input[name=stuID]').blur(checkStuID);
    $(':input[name=phone]').blur(checkPhone);
    $('.reset').click(resetEvent);
    $('.submit').click(checkValid);
});