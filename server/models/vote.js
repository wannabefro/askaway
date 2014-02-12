var mongoose = require('mongoose');
var voteSchema = new mongoose.Schema({
  user: {type: String, ref: 'User'},
  kind: {type: String},
  kind_id: {type: String, ref: 'Poll'}
});

module.exports = mongoose.model('Vote', voteSchema);
