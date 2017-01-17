var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var articleScheMa = new Schema({
  title: String,
  author: {type: Schema.Types.ObjectId, ref: 'users'},
  text: String,
  comments: [{type: Schema.Types.ObjectId, ref: 'comments'}],
  time: Date,
  hide: Boolean
});

module.exports = mongoose.model('posts', articleScheMa);
