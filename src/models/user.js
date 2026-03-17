const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 4,
      maxLength: 12,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      maxLength: 12,
      trim: true,
    },
    userName: {
      type: String,
      maxLength: 14,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: function (value) {
        if (!validator.isEmail(value)) {
          throw new Error("emailId is not valid");
        }
      },
    },

    password: {
      type: String,
    },
    provider: {
      type: String,
      enum: {
        values: ["local", "google"],
        message: `{VALUE} is not valid provider `,
      },
      default: "local",
    },
    profileURL: {
      type: String,
    },
    contactEmail: {
      type: String,
      validate: function (value) {
        if (!validator.isEmail(value)) {
          throw new Error("email is not valid");
        }
      },
    },
    contactPhoneNo: {
      type: Number,
      min: 1000000000,
      max: 9999999999,
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    skills: {
      type: [String],
      maxLength: 10,
    },
    githubURL: {
      type: String,
      validate: function (value) {
        if (!validator.isURL(value)) {
          throw new Error("github url is not valid");
        }
      },
    },
    leetcodeURL: {
      type: String,
      validate: function (value) {
        if (!validator.isURL(value)) {
          throw new Error("leetcode url is not valid");
        }
      },
    },
    instagramURL: {
      type: String,
      validate: function (value) {
        if (!validator.isURL(value)) {
          throw new Error("instagram url is not valid");
        }
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};

const User = new mongoose.model("User", userSchema);

module.exports = User;
