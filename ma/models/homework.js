var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var homeworkScheMa = new Schema({
  class: Number,
  title: String,
  url: String,
  beginTime: Date,
  reviewTime: Date,
  endTime: Date,
  status: Number
});

module.exports = mongoose.model('homeworks', homeworkScheMa);
