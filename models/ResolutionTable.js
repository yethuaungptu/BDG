const mongoose = require("mongoose");
var moment = require("moment-timezone");

const resolutionTableSchema = new mongoose.Schema({
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
  table: [
    {
      rowIdx: {
        type: String,
        required: true,
      },
      rowTitleMM: {
        type: String,
        required: true,
      },
      rowTitleEN: {
        type: String,
        required: true,
      },
      colData: [
        {
          titleMM: {
            type: String,
            required: true,
          },
          titleEN: {
            type: String,
            required: true,
          },
          subTitleMM: {
            type: String,
          },
          subTitleEN: {
            type: String,
          },
          roundMM: {
            type: String,
            required: true,
          },
          roundEN: {
            type: String,
            required: true,
          },
          isSpecial: {
            type: Boolean,
            default: false,
          },
        },
      ],
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
    default: Date.now,
  },
});

module.exports = mongoose.model("ResolutionTable", resolutionTableSchema);
