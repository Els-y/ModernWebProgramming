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
  var salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

userScheMa.methods.comparePassword = function(pwd) {
  return bcrypt.compareSync(pwd, this.password);
}

module.exports = mongoose.model('users', userScheMa);
