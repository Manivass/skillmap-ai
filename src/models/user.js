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
      unique: true,
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
      validate: function (value) {
        if (!validator.isURL(value, { require_protocol: true })) {
          throw new Error("profile URL is not valid");
        }
      },
    },
    Bio: {
      type: String,
      validate: function (value) {
        if (value.length > 450) {
          throw new Error("only 450 characters are allowed");
        }
      },
    },
    contactEmail: {
      type: String,
      validate: function (value) {
        if (!validator.isEmail(value)) {
          throw new Error("email is not valid");
        }
      },
    },
    careerGoal: {
      type: [String],
      enum: {
        values: ["fullstack" , "AI" , "devOps" , "cloud"],
        message: `{VALUE} is not valid goal`,
      },
    },
    contactPhoneNo: {
      type: String,
      validate: function (value) {
        if (!validator.isMobilePhone(value, "any")) {
          throw new Error("phone number is not valid");
        }
      },
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
      validate: [(arr) => arr.length <= 10, "only 10 skills are allowed"],
    },
    githubURL: {
      type: String,
      validate: function (value) {
        if (!validator.isURL(value, { require_protocol: true })) {
          throw new Error("github url is not valid");
        }
      },
    },
    leetcodeURL: {
      type: String,
      validate: function (value) {
        if (!validator.isURL(value, { require_protocol: true })) {
          throw new Error("leetcode url is not valid");
        }
      },
    },
    instagramURL: {
      type: String,
      validate: function (value) {
        if (!validator.isURL(value, { require_protocol: true })) {
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
