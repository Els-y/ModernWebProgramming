var http = require('http');
var url = require('url');
var route = require('./route');
var querystring = require('querystring');
var util = require('util');

function start(route, handler) {
    var server = http.createServer(requestHandler)
    server.listen(8000);
    console.log("Server running at http://127.0.0.1:8000/")
}

function requestHandler(request, response) {
    var method = request.method.toUpperCase();
    var pathname =  url.parse(request.url).pathname;

    console.log("Request for " + pathname + " received");

    if (method === 'GET') {
        route('GET', request, response);     
    } else if (method === 'POST') {
        var postData = '';

        request.addListener('data', function (chunk) {
            postData += chunk;
        });

        request.addListener('end', function () {
            postData = querystring.parse(postData);
            route('POST', request, response, postData);
        });        
    } 
    
}

exports.start = start;