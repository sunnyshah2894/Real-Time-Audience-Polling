var mongoose = require('mongoose');

var questionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    type: Number,
    questionString: String,
    options:[
      {
        optionIndex: Number,
        optionValue: String
      }
    ],
    answerIndex: Number,
    answerString: String,
    room:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room'
    }

});

var QuestionSchema = mongoose.model('Question', questionSchema);

module.exports = QuestionSchema;
