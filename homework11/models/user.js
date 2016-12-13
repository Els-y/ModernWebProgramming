var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

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

module.exports = mongoose.model('users', userScheMa);
