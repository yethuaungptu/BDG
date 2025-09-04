const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var moment = require("moment-timezone");

const TakeQuizSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
  quiz: {
    type: Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  answers: [
    {
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
      correctAnswer: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        default: false,
      },
      optionA: {
        type: String,
        required: true,
      },
      optionB: {
        type: String,
        required: true,
      },
      optionC: {
        type: String,
        required: true,
      },
      optionD: {
        type: String,
        required: true,
      },
    },
  ],
  totalScore: {
    type: Number,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  durationTaken: {
    type: String,
  },
});

module.exports = mongoose.model("TakeQuiz", TakeQuizSchema);
