var server = require('./bin/server');
var route = require('./bin/route');

server.start(route.route);