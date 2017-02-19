var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var reviewScheMa = new Schema({
  from: {type: Schema.Types.ObjectId, ref: 'users'},
  to: {type: Schema.Types.ObjectId, ref: 'users'},
  homework: {type: Schema.Types.ObjectId, ref: 'homeworks'},
  score: Number,
  content: String
});

module.exports = mongoose.model('reviews', reviewScheMa);
