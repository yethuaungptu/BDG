const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
var moment = require("moment-timezone");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Password required only if not Google user
      },
    },
    name: {
      type: String,
      required: true,
    },
    resolutionList: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ResolutionTable",
        },
        created: {
          type: Date,
          default: moment.utc(Date.now()).tz("Asia/Yangon").format(),
        },
      },
    ],
    googleId: {
      type: String,
      sparse: true, // Allows multiple null values
    },
    googleAccessToken: {
      type: String,
      sparse: true, // Allows multiple null values
    },
    googleRefreshToken: {
      type: String,
      sparse: true, // Allows multiple null values
    },
    avatar: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
