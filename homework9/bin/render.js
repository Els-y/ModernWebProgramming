function render(html, object) {
    var match, reg = /#\{(\w+)\}/g;
    while (match = reg.exec(html)) {
        console.log(match);
        html = html.replace(match[0], object[match[1]] ? object[match[1]] : "");
    }
    return html;
}

module.exports = render;