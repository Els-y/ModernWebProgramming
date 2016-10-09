function addLoadEvent(func) {
    var oldevent = window.onload;
    if (oldevent != "function") {
        window.onload = func;
    } else {
        window.onload = function() {
            oldevent();
            func();
        }
    }
}

function prepareButton() {
    var button_list = document.getElementsByTagName('button');
    var expression = document.getElementById('expression');
    var result = document.getElementById('result')
    var btn_equal = document.getElementById('btn-equal');
    var oldtext, ans, error;

    for (var i = 0; i < button_list.length; ++i) {
        if (button_list[i].getAttribute('id') == 'btn-delete') {
            button_list[i].onclick = function() {
                oldtext = expression.innerHTML;
                if (oldtext == 'expression') return;
                expression.innerHTML = oldtext.slice(0, oldtext.length - 1);
                if (expression.innerHTML.length == 0)
                    expression.innerHTML = 'expression';
                this.blur();
            }
        } else if (button_list[i].getAttribute('id') == 'btn-clear') {
            button_list[i].onclick = function() {
                expression.innerHTML = "expression";
                btn_equal.hasclick = false;
                result.innerHTML = '0';
                result.style.fontSize = "2.5em";
                this.blur();
            }
        } else if (button_list[i].getAttribute('id') == 'btn-equal') {
            button_list[i].onclick = function() {
                error = false;
                if (expression.innerHTML == 'expression') return;
                try {
                    ans = eval(expression.innerHTML);
                } catch (err) {
                    alert("Expression Error");
                    error = true;
                    document.getElementById("btn-clear").onclick();
                }
                if (!error) {
                    if (ans.toString().indexOf('.') != -1) {
                        if (ans.toFixed(4).toString().length >= 21)
                            result.style.fontSize = "1.2em";
                        if (ans.toFixed(4).toString().length > 17)
                            result.style.fontSize = "1.6em";
                        else if (ans.toFixed(4).toString().length >= 14)
                            result.style.fontSize = "2em";
                        else
                            result.style.fontSize = "2.5em";
                        result.innerHTML = ans.toFixed(4);
                    } else{
                        if (ans.toString().length >= 21)
                            result.style.fontSize = "1.2em";
                        if (ans.toString().length > 17)
                            result.style.fontSize = "1.6em";
                        else if (ans.toString().length >= 14)
                            result.style.fontSize = "2em";
                        else
                            result.style.fontSize = "2.5em";
                        result.innerHTML = ans;
                        }
                    this.hasclick = true;
                }
                this.blur();
            }
        } else if (button_list[i].getAttribute('id').indexOf('value') != -1) {
            button_list[i].onclick = function() {
                oldtext = expression.innerHTML;
                if (oldtext == 'expression') {
                    expression.innerHTML = this.innerHTML;
                } else if (btn_equal.hasclick) {
                    expression.innerHTML = this.innerHTML;
                    btn_equal.hasclick = false;
                } else {
                    expression.innerHTML = oldtext + this.innerHTML;
                }
                this.blur();
            }
        } else {
            button_list[i].onclick = function() {
                oldtext = expression.innerHTML;
                if (oldtext == 'expression') {
                    expression.innerHTML = this.innerHTML;
                } else if (btn_equal.hasclick) {
                    expression.innerHTML = result.innerHTML + this.innerHTML;
                    btn_equal.hasclick = false;
                } else {
                    expression.innerHTML = oldtext + this.innerHTML;
                }
                this.blur();
            }
        }
    }
}

document.onkeydown = function(event) {
    var e = event || window.event;
    if (e && e.keyCode == 56 && e.shiftKey)
        document.getElementById('btn-multiply').click();
    else if (e && e.keyCode >= 96 && e.keyCode <= 105)
        document.getElementById('btn-value-' + (e.keyCode - 96)).click();
    else if (e && e.keyCode >= 48 && e.keyCode <= 57)
        document.getElementById('btn-value-'+(e.keyCode - 48)).click();
    else if (e && e.keyCode == 107)
        document.getElementById('btn-add').click();
    else if (e && e.keyCode == 109)
        document.getElementById('btn-minus').click();
    else if (e && e.keyCode == 106)
        document.getElementById('btn-multiply').click();
    else if (e && e.keyCode == 111)
        document.getElementById('btn-divide').click();
    else if (e && e.keyCode == 110)
        document.getElementById('btn-dot').click();
    else if (e && e.keyCode == 13)
        document.getElementById('btn-equal').click();
    else if (e && e.keyCode == 8)
        document.getElementById('btn-delete').click();
    else if (e && e.keyCode == 187 && e.shiftKey)
        document.getElementById('btn-add').click();
    else if (e && e.keyCode == 187)
        document.getElementById('btn-equal').click();
    else if (e && e.keyCode == 189)
        document.getElementById('btn-minus').click();
}

addLoadEvent(prepareButton);