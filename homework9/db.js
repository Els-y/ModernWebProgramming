var fs = require('fs');

function queryByUsername(username) {
    var db = JSON.parse(fs.readFileSync('data/db.txt'));
    return db.filter(function (user) {
        return user.username === username;
    });
}

function queryByStuID(stuID) {
    var db = JSON.parse(fs.readFileSync('data/db.txt'));
    return db.filter(function (user) {
        return user.stuID === stuID;
    });
}

function queryByPhone(phone) {
    var db = JSON.parse(fs.readFileSync('data/db.txt'));
    return db.filter(function (user) {
        return user.phone === phone;
    });
}

function queryByEmail(email) {
    var db = JSON.parse(fs.readFileSync('data/db.txt'));
    return db.filter(function (user) {
        return user.email === email;
    });
}

function insert(username, stuID, phone, email) {
    var db = JSON.parse(fs.readFileSync('data/db.txt'));
    var user = {username: username,
                        stuID: stuID,
                        phone: phone,
                        email: email};
    db.push(user);
    fs.writeFileSync('data/db.txt', JSON.stringify(db));
    console.log("Add new user successfully.");
}

function info_exist(user) {
    var db = JSON.parse(fs.readFileSync('data/db.txt'));
    for (var i = 0; i < db.length; ++i) {
        if (db[i].username === user.username)
            return 1;
        else if (db[i].stuID === user.stuID)
            return 2;
        else if (db[i].phone === user.phone)
            return 3;
        else if (db[i].email === user.email)
            return 4;
    }
    return 0;
}

exports.queryByUsername = queryByUsername;
exports.queryByStuID = queryByStuID;
exports.queryByPhone = queryByPhone;
exports.queryByEmail = queryByEmail;
exports.insert = insert;
exports.info_exist = info_exist;