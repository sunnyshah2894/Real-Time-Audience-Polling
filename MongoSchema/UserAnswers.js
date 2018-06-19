var mongoose = require('mongoose');

var questionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    questionID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    userAnswerIndex: Number,
    userAnswerString: String,
    actualAnswerString: String,
    actualAnswerIndex: Number,
    roomID:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room'
    },
    time: Date

});

var QuestionSchema = mongoose.model('UserAnswers', questionSchema);

module.exports = QuestionSchema;
