var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Promise = require('bluebird');

var Schema = mongoose.Schema;
var userScheMa = new Schema({
  stuid: String,
  password: String,
  name: String,
  class: Number,
  group: Number,
  role: Number  // 0: student, 1: ta, 2: teacher
});

// userScheMa.pre('save', function(next) {
//   this.encryptPassword();
//   next();
// });

userScheMa.methods.encryptPassword = function() {
  var salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
};

userScheMa.methods.comparePassword = function(pwd) {
  return bcrypt.compareSync(pwd, this.password);
};

module.exports = mongoose.model('users', userScheMa);
