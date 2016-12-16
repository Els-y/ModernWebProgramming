var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Promise = require('bluebird');

var Schema = mongoose.Schema;
var userScheMa = new Schema({
  username: String,
  password: String,
  stuID: String,
  email: String,
  phone: String
});

userScheMa.pre('save', function(next) {
  this.encryptPassword();
  next();
});

userScheMa.methods.encryptPassword = function() {
  var salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
};

userScheMa.methods.comparePassword = function(pwd) {
  return bcrypt.compareSync(pwd, this.password);
};

userScheMa.statics.checkExist = function(userInfo) {
  var promiseList = [
    this.findOne({username: userInfo.username}).exec(),
    this.findOne({stuID: userInfo.stuID}).exec(),
    this.findOne({phone: userInfo.phone}).exec(),
    this.findOne({email: userInfo.email}).exec(),
  ];

  var message = {
    "username": "Username already exists",
    "stuID": "Student Number already exists",
    "phone": "Phone already exists",
    "email": "Email already exists",
  };

  return Promise.all(promiseList).spread(function(uname, uid, uphone, uemail) {
    if (uname) {
      return Promise.reject(message.username);
    } else if (uid) {
      return Promise.reject(message.stuID);
    } else if (uphone) {
      return Promise.reject(message.phone);
    } else if (uemail) {
      return Promise.reject(message.uemail);
    } else {
      return Promise.resolve();
    }
  });
};

module.exports = mongoose.model('users', userScheMa);
