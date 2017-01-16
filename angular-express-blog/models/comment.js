var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var commentSchema = new Schema({
  post: {type: Schema.Types.ObjectId, ref: 'posts'},
  author: {type: Schema.Types.ObjectId, ref: 'users'},
  content: String,
  time: Date,
});

module.exports = mongoose.model('comments', commentSchema);
