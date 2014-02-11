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
  choices: [choiceSchema]
});

module.exports = mongoose.model('Poll', pollSchema);
