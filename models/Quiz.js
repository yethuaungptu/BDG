const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var moment = require("moment-timezone");

const QuizSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  durationMinutes: {
    type: Number,
    default: 1,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
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
      correctAnswer: {
        type: String,
        required: true,
      },
    },
  ],
  created: {
    type: Date,
    default: moment.utc(Date.now()).tz("Asia/Yangon").format(),
  },
  updated: {
    type: Date,
    default: moment.utc(Date.now()).tz("Asia/Yangon").format(),
  },
});

module.exports = mongoose.model("Quiz", QuizSchema);
