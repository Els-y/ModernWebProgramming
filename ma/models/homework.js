var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var homeworkScheMa = new Schema({
  class: Number,
  title: String,
  url: String,
  beginTime: Date,
  reviewTime: Date,
  endTime: Date,
  maxScore: Number,
  submitted: [{type: Schema.Types.ObjectId, ref: 'users'}],
  reviewGroup: [Number],
  status: Number
});

module.exports = mongoose.model('homeworks', homeworkScheMa);
