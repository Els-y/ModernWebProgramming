var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var uploadScheMa = new Schema({
  author: {type: Schema.Types.ObjectId, ref: 'users'},
  homework: {type: Schema.Types.ObjectId, ref: 'homeworks'},
  code: String,
  preview: String,
  github: String,
});

module.exports = mongoose.model('uploads', uploadScheMa);
