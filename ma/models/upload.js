var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var uploadScheMa = new Schema({
  author: {type: Schema.Types.ObjectId, ref: 'users'},
  homework: {type: Schema.Types.ObjectId, ref: 'homeworks'},
  class: Number,
  group: Number,
  filename: String,
  github: String,
});

module.exports = mongoose.model('uploads', uploadScheMa);
