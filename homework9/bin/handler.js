var path = require('path');
var fs = require('fs');
var db = require('./db');
var render = require('./render');
var views_path = 'views/';

function load(response, pathname) {
    var ext = path.extname(pathname);
    var MIME = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.jpg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif'
    };

    if (ext === '') pathname = views_path + "index.html";
    if (ext === '.ico') {
        response.writeHead(404);
        response.end();
    } else if (ext !== '.html' && ext !== '') {
        fs.readFile(pathname.slice(1), 'binary', function(err, data) {
            if (err) {
                response.writeHead(404, {'Content-Type': MIME[ext]});
                response.end(err);j
            } else {
                response.writeHead(200, {'Content-Type': MIME[ext]});
                response.write(data, 'binary');
            }
            response.end();
        });
    } else {
        fs.readFile(views_path + "index.html", function(err, data) {
            if (err) {
                response.writeHead(404, {'Content-Type': MIME[ext]});
                response.end(err);j
            } else {
                response.writeHead(200, {'Content-Type': MIME[ext]});
                response.end(data);
            }
        });
    }
}

function login(response, username) {
    var user = db.queryByUsername(username);
    if (user.length !== 0) {
        fs.readFile(views_path + "user.html", function(err, data) {
            if (err) {
                response.writeHead(404, {'Content-Type': "text/html"});
                response.end(err);j
            } else {
                data = render(data.toString(), user[0]);
                response.writeHead(200, {'Content-Type': "text/html"});
                response.end(data);
            }
        });
    } else {
        load(response, "/");
    }
}

function register(response, postData) {
    var exist = db.info_exist(postData);
    if (exist === 0) {
        db.insert(postData.username, postData.stuID, postData.phone, postData.email);
        login(response, postData.username);
    } else if (exist === 1) {
        console.log("[Rigister] Username already exists");
    } else if (exist === 2) {
        console.log("[Rigister] Student Number already exists");
    } else if (exist === 3) {
        console.log("[Rigister] Phone already exists");
    } else if (exist === 4) {
        console.log("[Rigister] Email already exists");
    }

    if (exist !== 0) load(response, "/");
}

function checkIfExist(response, postData) {
    var funcMap = {
        "username": {"query": db.queryByUsername, "message": "Username already exists"},
        "stuID": {"query": db.queryByStuID, "message": "Student Number already exists"},
        "phone": {"query": db.queryByPhone, "message": "Phone already exists"},
        "email": {"query": db.queryByEmail, "message": "Email already exists"}
    };
    var users = funcMap[postData.key]["query"](postData.value);

    response.writeHead(200, {'Content-Type': 'text/plain'});
    if (users.length !== 0) {
        response.end(funcMap[postData.key].message);
    } else {
        response.end("passed");
    }
}

exports.load = load;
exports.login = login;
exports.register = register;
exports.checkIfExist = checkIfExist;
