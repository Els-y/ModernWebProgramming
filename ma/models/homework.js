var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var homeworkScheMa = new Schema({
  author: {type: Schema.Types.ObjectId, ref: 'users'},
  identifier: Number,
  time: Date
});

module.exports = mongoose.model('homeworks', homeworkScheMa);
