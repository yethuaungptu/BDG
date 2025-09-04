const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var moment = require("moment-timezone");

const MeditateSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  guider: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  minutes: {
    type: Number,
    required: true,
  },
  seconds: {
    type: Number,
    required: true,
  },
  steps: [
    {
      number: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
  ],
  helps: [
    {
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
    },
  ],
  mediaUrl: {
    type: String,
    required: true,
  },
  mediaType: {
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
  isFeatured: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Meditate", MeditateSchema);
