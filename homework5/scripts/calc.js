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
    var oldtext, ans, error, btn;

    for (var i = 0; i < button_list.length; ++i) {
        btn = button_list[i];
        if (btn.getAttribute('id') == 'btn-delete') {
            btn.onclick = function() {
                oldtext = expression.innerHTML;
                if (oldtext == 'expression') return;
                expression.innerHTML = oldtext.slice(0, oldtext.length - 1);
                if (expression.innerHTML.length == 0)
                    expression.innerHTML = 'expression';
                this.blur();
            }
        } else if (btn.getAttribute('id') == 'btn-clear') {
            btn.onclick = function() {
                expression.innerHTML = "expression";
                result.innerHTML = '0';
                btn_equal.hasclick = false;
                this.blur();
            }
        } else if (btn.getAttribute('id') == 'btn-equal') {
            btn.onclick = function() {
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
                    if (ans.toString().indexOf('.') != -1)
                        result.innerHTML = ans.toFixed(4);
                    else
                        result.innerHTML = ans;
                    this.hasclick = true;
                }
                this.blur();
            }
        } else if (btn.getAttribute('class') == 'number') {
            btn.onclick = function() {
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
            btn.onclick = function() {
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
    if (e && e.keyCode >= 96 && e.keyCode <= 105)
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
}

addLoadEvent(prepareButton);