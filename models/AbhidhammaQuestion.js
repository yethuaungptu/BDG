const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var moment = require("moment-timezone");

const AbhidhammaQuestionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  pdfFilePath: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: moment.utc(Date.now()).tz("Asia/Yangon").format(),
  },
  updated: {
    type: Date,
    default: moment.utc(Date.now()).tz("Asia/Yangon").format(),
  },
});

module.exports = mongoose.model("AbhidhammaQuestion", AbhidhammaQuestionSchema);
