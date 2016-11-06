function bindTable() {
    $ths = $("th");
    $ths.click(sortTable());
    if ($ths.find("caret").length == 0)
        $ths.append('<span class="caret"></span>');
}

function sortTable() {
    var last_col = -1;
    var asc = -1;

    return function() {
        var $this = $(this);
        var col_num = $this.parent().children().index($this);
        var $table = $this.parents("table");
        var $trs = $table.find("tbody").find("tr");

        if ($table.find("thead").length === 0) Array.prototype.shift.call($trs);
        $trs = $trs.detach();

        if (last_col !== col_num) asc = -1;
        else asc *= -1;

        Array.prototype.sort.call($trs, function(first, second) {
            var fHtml = $(first).children().eq(col_num).html();
            var sHtml = $(second).children().eq(col_num).html();
            if (fHtml < sHtml) {
                return asc;
            } else if (fHtml > sHtml) {
                return -asc;
            } else {
                return 0;
            }
        });
        last_col = col_num;

        $trs.removeClass("alternate").filter(":odd").addClass("alternate");
        $table.append($trs).find(".active").removeClass("active").find(".caret").removeClass("ascend descend");
        $this.addClass("active").find(".caret").addClass(asc === -1 ? "ascend" : "descend");
    }
}

$(function () {
    bindTable();
})