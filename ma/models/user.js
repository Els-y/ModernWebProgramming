var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Promise = require('bluebird');

var Schema = mongoose.Schema;
var userScheMa = new Schema({
  stuid: String,  // 用户名学号
  password: String,
  name: String,
  class: Number,  // 所在班级
  group: Number,  // 所在小组
  role: Number  // 权限 0: 学生, 1: TA, 2: 教师
});

userScheMa.methods.encryptPassword = function() {
  var salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
};

userScheMa.methods.comparePassword = function(pwd) {
  return bcrypt.compareSync(pwd, this.password);
};

module.exports = mongoose.model('users', userScheMa);
