const mongoose = require("mongoose");
var moment = require("moment-timezone");

const resolutionProcessSchema = new mongoose.Schema({
  titleMM: {
    type: String,
    required: true,
    trim: true,
  },
  titleEN: {
    type: String,
    required: true,
    trim: true,
  },
  contentMM: {
    type: String,
    required: true,
  },
  contentEN: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  startDay: {
    type: String,
    required: true,
  },
  durationDays: {
    type: Number,
    required: true,
  },
  remark: {
    type: String,
  },
  steps: [
    {
      number: {
        type: Number,
        required: true,
      },
      descriptionMM: {
        type: String,
        required: true,
      },
      descriptionEN: {
        type: String,
        required: true,
      },
    },
  ],

  dailyTasks: [
    {
      day: {
        type: Number,
        required: true,
      },
      titleMM: {
        type: String,
        required: true,
      },
      titleEN: {
        type: String,
        required: true,
      },
      descriptionMM: {
        type: String,
        required: true,
      },
      descriptionEN: {
        type: String,
        required: true,
      },
    },
  ],
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
});

module.exports = mongoose.model("ResolutionProcess", resolutionProcessSchema);
