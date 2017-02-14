var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var homeworkScheMa = new Schema({
  class: Number,
  title: String,
  url: String,
  beginTime: Date,
  reviewTime: Date,
  endTime: Date,
  submitted: [{type: Schema.Types.ObjectId, ref: 'users'}],
  status: Number
});

module.exports = mongoose.model('homeworks', homeworkScheMa);
