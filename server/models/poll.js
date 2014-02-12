var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var choiceSchema = new mongoose.Schema({ 
  text: String,
    votes: [{
      type: Schema.Types.ObjectId, ref: 'Vote'
    }]
});
var pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  choices: [choiceSchema],
  user: {type: String, ref: 'User'},
  public: {type: Boolean, default: true}
});

module.exports = mongoose.model('Poll', pollSchema);
