var server = require('./server');
var route = require('./route');

server.start(route.route);