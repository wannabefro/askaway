var mongoose = require('mongoose');
var voteSchema = new mongoose.Schema({
  _user: {type: String, ref: 'User'},
  kind: {type: String},
  _kind_id: {type: String, ref: 'Poll'}
});

module.exports = mongoose.model('Vote', voteSchema);
