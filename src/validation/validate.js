const validator = require("validator");
const User = require("../models/user");

const validateAndSanitizeLoginData = async (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !emailId || !password) {
    throw new Error("pls fill all the credentials");
  }
  const existingUser = await User.findOne({ emailId: emailId });
  if (existingUser) {
    throw new Error("email is already used");
  }
  if (firstName.length < 4 || firstName.length > 12) {
    throw new Error("first name must be 4 to 12 characters");
  }
  if (lastName.length > 12) {
    throw new Error("last name must have less than 12 characters");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must have 7 characters , 1 uppercase , 1 special charcters",
    );
  }
};

module.exports = { validateAndSanitizeLoginData };
