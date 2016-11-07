var path = require('path');
var fs = require('fs');
var pug = require('pug');
var db = require('./db');
var views_path = 'views/';

function load(response, pathname, warning) {
    var ext = path.extname(pathname);
    var MIME = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.jpg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif'
    };

    if (ext === '.ico') {
        response.writeHead(404);
        response.end();
    } else if (ext !== '.html' && ext !== '') {
        fs.readFile(pathname.slice(1), 'binary', function (err, data) {
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
        var index = pug.compileFile(views_path + 'index.pug');
        response.write(index({warning: warning}));
        response.end();
    }
}

function login(response, username) {
    var user = db.queryByUsername(username);
    if (user.length !== 0) {
        var user_pug = pug.compileFile(views_path + 'user.pug');
        response.write(user_pug({user: user[0]}));
        response.end();
    } else {
        load(response, "/");
    }
}

function register(response, postData) {
    var exist = db.info_exist(postData);
    var err = '';
    if (exist === 0) {
        db.insert(postData.username, postData.stuID, postData.phone, postData.email);
        login(response, postData.username);
    } else if (exist === 1) {
        err = "Username has existed";
        console.log("[Rigister] Username has existed");
    } else if (exist === 2) {
        err = "Student Number has existed";
        console.log("[Rigister] Student Number has existed");
    } else if (exist === 3) {
        err = "Phone has existed";
        console.log("[Rigister] Phone has existed");
    } else if (exist === 4) {
        err = "Email has existed";
        console.log("[Rigister] Email has existed");
    }

    if (exist !== 0) load(response, "/", err);
}

exports.load = load;
exports.login = login;
exports.register = register;
