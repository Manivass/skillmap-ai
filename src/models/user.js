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
