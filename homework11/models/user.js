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
  var queryArray = [
    {username: userInfo.username},
    {stuID: userInfo.stuID},
    {phone: userInfo.phone},
    {email: userInfo.email}
  ];

  var message = {
    "username": "Username already exists",
    "stuID": "Student Number already exists",
    "phone": "Phone already exists",
    "email": "Email already exists",
  };

  return this.findOne({$or: queryArray}).exec().then(function(user) {
    if (!user) {
      return Promise.resolve();
    } else if (user.username === userInfo.username) {
      return Promise.reject(message.username);
    } else if (user.stuID === userInfo.stuID) {
      return Promise.reject(message.stuID);
    } else if (user.phone === userInfo.phone) {
      return Promise.reject(message.phone);
    } else {
      return Promise.reject(message.uemail);
    }
  });
};

module.exports = mongoose.model('users', userScheMa);
