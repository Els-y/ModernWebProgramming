url:
http://www.runoob.com/jquery/jquery-events.html
http://plugins.jquery.com/tablesorter/
https://en.wikipedia.org/wiki/Ranked_list_of_Malagasy_provinces
https://en.wikipedia.org/wiki/Pyramid_Song

code:

function sortTable(){var last_col=-1;var asc=-1;return function(){var $this=$(this);var col_num=$this.parent().children().index($this);var $table=$this.parents("table");var $trs=$table.find("tbody").find("tr");if($table.find("thead").length===0){Array.prototype.shift.call($trs)}$trs=$trs.detach();if(last_col!==col_num){asc=-1}else{asc*=-1}Array.prototype.sort.call($trs,function(first,second){var ftext=$(first).children().eq(col_num).text();var stext=$(second).children().eq(col_num).text();if(ftext<stext){return asc}else{if(ftext>stext){return -asc}else{return 0}}});last_col=col_num;$table.append($trs)}}$("th").click(sortTable());