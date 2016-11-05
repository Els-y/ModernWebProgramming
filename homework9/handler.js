var path = require('path');
var fs = require('fs');
var db = require('./db');

function load(response, pathname, warning) {
    var ext = path.extname(pathname);
    pathname = pathname.slice(1);

    // if (ext === '.html') {
    //     response.writeHead(200, {'Content-Type': 'text/html'});
    // } else 
    if (ext === '.css') {
        response.writeHead(200, {'Content-Type': 'text/css'});
    } else if (ext === '.js') {
        response.writeHead(200, {'Content-Type': 'application/javascript'});
    } else if (ext === '.png') {
        response.writeHead(200, {'Content-Type': 'image/png'});
    } else if (ext === '.gif') {
        response.writeHead(200, {'Content-Type': 'image/gif'});
    } else if (ext === '.jpg') {
        response.writeHead(200, {'Content-Type': 'image/jpeg'});
    } else {
        response.writeHead(200, {'Content-Type': 'text/html'});
        pathname = 'index.html';
    }

    if (pathname === 'index.html') pathname = 'views/index.html';

    if (ext === '.png' || ext === '.gif' || ext === '.jpg') {
        fs.readFile(pathname, 'binary', function (err, data) {
            if (err) {
                console.log(err);
                response.writeHead(404, {'Content-Type': 'image/png'})
            } else {
                response.write(data, 'binary');
            }
            response.end();
        })
    } else if (ext === '.css' || ext === '.js') {
        fs.readFile(pathname, function (err, data) {
            if (err) {
                console.log(err);
                response.writeHead(404, {'Content-Type': 'text/html'})
            } else {
                response.write(data.toString());
            }
            response.end();
        });
    } else {
        response.write('<!DOCTYPE html>\n');
        response.write('<html lang="en">\n');
        response.write('<head>\n');
        response.write('    <meta charset="UTF-8">\n');
        response.write('    <title>Sign Up</title>\n');
        response.write('    <meta name="viewport" content="width=device-width, initial-scale=1">\n');
        response.write('    <link rel="stylesheet" href="http://apps.bdimg.com/libs/bootstrap/3.3.0/css/bootstrap.min.css">\n');
        response.write('    <link rel="stylesheet" href="../styles/general.css">\n');
        response.write('    <link rel="stylesheet" href="../styles/index.css">\n');
        response.write('    <script src="http://apps.bdimg.com/libs/jquery/2.1.1/jquery.min.js"></script>\n');
        response.write('    <script src="http://apps.bdimg.com/libs/bootstrap/3.3.0/js/bootstrap.min.js"></script>\n');
        response.write('    <script src="../scripts/index.js"></script>\n');
        response.write('</head>\n');
        response.write('<body>\n');
        response.write('    <div class="navbar navbar-inverse">\n');
        response.write('        <div class="container">\n');
        response.write('            <div class="navbar-header">\n');
        response.write('                <button class="navbar-toggle" data-target=".navbar-collapse" data-toggle="collapse">\n');
        response.write('                    <span class="icon-bar"></span>\n');
        response.write('                    <span class="icon-bar"></span>\n');
        response.write('                    <span class="icon-bar"></span>\n');
        response.write('                </button>\n');
        response.write('                <a href="index.html" class="navbar-brand">Student</a>\n');
        response.write('            </div>\n');
        response.write('            <div class="navbar-collapse collapse">\n');
        response.write('                <ul class="nav navbar-nav navbar-right">\n');
        response.write('                    <li><a href=""><span class="glyphicon glyphicon-user"></span> Register</a></li>\n');
        response.write('                </ul>\n');
        response.write('            </div>\n');
        response.write('        </div>\n');
        response.write('    </div>\n');
        response.write('\n');
        response.write('    <div class="container">\n');
        response.write('        <div class="col-md-4 col-md-offset-4">\n');
        response.write('            <form action="" method="post" role="form" id="login-form" onsubmit="return true;">\n');
        response.write('                <h3>Register</h3>\n');
        response.write('                <hr />\n');
        if (warning) {
            response.write('                <div class="alert alert-warning">\n');
            response.write('                    <a href="#" class="close" data-dismiss="alert">&times;</a>\n');
            response.write('                    ' + warning + '\n');
            response.write('                </div>\n');
        }
        response.write('                <div class="form-group">\n');
        response.write('                    <div class="input-group">\n');
        response.write('                        <span class="input-group-addon">\n');
        response.write('                            <span class="glyphicon glyphicon-user"></span>\n');
        response.write('                        </span>\n');
        response.write('                        <input type="text" class="form-control" name="username" placeholder="Username">\n');
        response.write('                    </div>\n');
        response.write('                </div>\n');
        response.write('                <div class="form-group">\n');
        response.write('                    <div class="input-group">\n');
        response.write('                        <span class="input-group-addon">\n');
        response.write('                            <span class="glyphicon glyphicon-lock"></span>\n');
        response.write('                        </span>\n');
        response.write('                        <input type="text" class="form-control" name="stuID" placeholder="Student Number">  \n');
        response.write('                    </div>\n');
        response.write('                </div>\n');
        response.write('                <div class="form-group">\n');
        response.write('                    <div class="input-group">\n');
        response.write('                        <span class="input-group-addon">\n');
        response.write('                            <span class="glyphicon glyphicon-earphone"></span>\n');
        response.write('                        </span>\n');
        response.write('                        <input type="text" class="form-control" name="phone" placeholder="Mobile phone">\n');
        response.write('                    </div>\n');
        response.write('                </div>\n');
        response.write('                <div class="form-group">\n');
        response.write('                    <div class="input-group">\n');
        response.write('                        <span class="input-group-addon">\n');
        response.write('                        <span class="glyphicon glyphicon-envelope"></span>\n');
        response.write('                        </span>\n');
        response.write('                        <input type="text" class="form-control" name="email" placeholder="Email">\n');
        response.write('                    </div>\n');
        response.write('                </div>\n');
        response.write('                <div class="form-group pull-right">\n');
        response.write('                    <input class="btn btn-primary" type="submit" value="Register">\n');
        response.write('                    <input class="btn btn-default reset" type="reset" value="Reset">\n');
        response.write('                </div>\n');
        response.write('                <div class="clear"></div>\n');
        response.write('            </form>\n');
        response.write('        </div>\n');
        response.write('    </div>\n');
        response.write('</body>\n');
        response.write('</html>\n');
        response.end();
    }
}

function login(response, username) {
    var user = db.queryByUsername(username);
    if (user.length !== 0) {
        response.write('<!DOCTYPE html>\n');
        response.write('<html lang="en">\n');
        response.write('<head>\n');
        response.write('    <meta charset="UTF-8">\n');
        response.write('    <title>Sign Up</title>\n');
        response.write('    <meta name="viewport" content="width=device-width, initial-scale=1">\n');
        response.write('    <link rel="stylesheet" href="http://apps.bdimg.com/libs/bootstrap/3.3.0/css/bootstrap.min.css">\n');
        response.write('    <link rel="stylesheet" href="../styles/general.css">\n');
        response.write('    <link rel="stylesheet" href="../styles/user.css">\n');
        response.write('    <script src="http://apps.bdimg.com/libs/jquery/2.1.1/jquery.min.js"></script>\n');
        response.write('    <script src="http://apps.bdimg.com/libs/bootstrap/3.3.0/js/bootstrap.min.js"></script>\n');
        response.write('</head>\n');
        response.write('<body>\n');
        response.write('    <div class="navbar navbar-inverse">\n');
        response.write('        <div class="container">\n');
        response.write('            <div class="navbar-header">\n');
        response.write('                <button class="navbar-toggle" data-target=".navbar-collapse" data-toggle="collapse">\n');
        response.write('                    <span class="icon-bar"></span>\n');
        response.write('                    <span class="icon-bar"></span>\n');
        response.write('                    <span class="icon-bar"></span>\n');
        response.write('                </button>\n');
        response.write('                <a href="#" class="navbar-brand">Student</a>\n');
        response.write('            </div>\n');
        response.write('            <div class="navbar-collapse collapse">\n');
        response.write('                <ul class="nav navbar-nav navbar-right">\n');
        response.write('                    <li><a href="index.html"><span class="glyphicon glyphicon-log-out"></span> Logout</a></li>\n');
        response.write('                </ul>\n');
        response.write('            </div>\n');
        response.write('        </div>\n');
        response.write('    </div>\n');
        response.write('    <div class="container">\n');
        response.write('        <div class="page-header">\n');
        response.write('            <h1>Welcome</h1>\n');
        response.write('        </div>\n');
        response.write('        <div class="rows">\n');
        response.write('            <div class="information col-md-4 col-md-offset-4">\n');
        response.write('                <div class="info-group">\n');
        response.write('                    <p><span class="tag">Username: </span>' + user[0].username + '</p>\n');
        response.write('                </div>');
        response.write('                <div class="info-group">');
        response.write('                    <p><span class="tag">Student Number: </span>' + user[0].stuID + '</p>\n');
        response.write('                </div>');
        response.write('                <div class="info-group">');
        response.write('                    <p><span class="tag">Phone: </span>' + user[0].phone + '</p>\n');
        response.write('                </div>');
        response.write('                <div class="info-group">');
        response.write('                    <p><span class="tag">Email: </span>' + user[0].email + '</p>\n');
        response.write('                </div>\n');
        response.write('            </div>\n');
        response.write('        </div>\n');
        response.write('    </div>\n');
        response.write('</body>\n');
        response.write('</html>\n');
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