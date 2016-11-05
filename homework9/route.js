var url = require('url');
var handler = require('./handler');
var util = require('util');

function route(method, request, response, postData) {
    if (method === 'GET') {
        var parse = url.parse(request.url, true);
        var pathname = parse.pathname;
        var username = parse.query.username;

        console.log('[GET] ' + pathname);

        if (username) {
            handler.login(response, username);
        } else {
            handler.load(response, pathname);
        }
    } else {
        console.log('[POST] postData = ');
        console.log(postData);
        handler.register(response, postData);
    }
}

module.exports = route;