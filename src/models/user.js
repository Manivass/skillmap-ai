const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minLength: 4,
    maxLength: 12,
    required: true,
  },
  lastName: {
    type: String,
    maxLength: 12,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    validate: function (value) {
      if (!validator.isEmail(value)) {
        throw new Error("emailId is not valid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    validate: function (value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("password is not strong");
      }
    },
  },
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
