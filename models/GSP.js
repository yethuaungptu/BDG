const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var moment = require("moment-timezone");

const GSPSchema = new Schema({
  titleMM: {
    type: String,
    required: true,
  },
  titleEN: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  mmContent: {
    type: String,
    required: true,
  },
  enContent: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
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

module.exports = mongoose.model("GSP", GSPSchema);
