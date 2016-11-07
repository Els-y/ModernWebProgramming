function sortTable() {
    var last_col = -1, asc = -1;
    return function() {
        var $this = $(this), col_num = $this.parent().children().index($this);
        var $table = $this.parents("table"), $trs = $table.find("tbody").find("tr");
        if (last_col !== col_num) asc = -1;  // 判断是升序还是降序，与上次不同则升序排列，否则取反
        else asc *= -1;
        filterThead($table, $trs);　　// 过滤掉没有thead的表格中tr的第一行，一般即为包含th的tr
        sortHandler($trs, col_num, asc);　　//　排序
        updateTable($this, $trs, $table, asc);　　//　更新表格
        last_col = col_num;
    };
}

function filterThead($table, $trs) {
    if ($table.find("thead").length == 0) Array.prototype.shift.call($trs);
    $trs = $trs.detach();
}

function sortHandler($trs, col_num, asc) {
    Array.prototype.sort.call($trs, function(first, second) {
        var ftext = $(first).children().eq(col_num).text();
        var stext = $(second).children().eq(col_num).text();
        if (ftext < stext)
            return asc;
        else if (ftext > stext)
            return -asc;
        else
            return 0;
    });
}

function updateTable($th, $trs, $table, asc) {
    $trs.removeClass("alternate").filter(":odd").addClass("alternate");
    $table.append($trs)
          .find(".active").removeClass("active")  // 表头的颜色改变
          .find(".caret").removeClass("ascend descend");　　//　三角改变
    $th.addClass("active")
       .find(".caret").addClass(asc === -1 ? "ascend" : "descend");
}

$(function () {
    $ths = $("th");
    $ths.click(sortTable());
    if ($ths.find("caret").length == 0)
        $ths.append('<span class="caret"></span>');
})