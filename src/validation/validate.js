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

const validateProfileSetup = async (req) => {
  const {
    userName,
    profileURL,
    contactEmail,
    contactPhoneNo,
    skills,
    githubURL,
    leetcodeURL,
    instagramURL,
  } = req.body;

  if (userName) {
    const userNameAlreadyAvailable = await User.findOne({ userName });
    if (
      userNameAlreadyAvailable &&
      userNameAlreadyAvailable._id.toString() !== req.user._id.toString()
    ) {
      throw new Error("username is already exist.");
    }
  }
  if (profileURL && !validator.isURL(profileURL)) {
    throw new Error("profile URL is not valid");
  }
  if (contactPhoneNo && !validator.isMobilePhone(contactPhoneNo, "any")) {
    throw new Error("mobile phone is not valid");
  }
  if (contactEmail && !validator.isEmail(contactEmail)) {
    throw new Error("email is not valid");
  }
  if (githubURL && !validator.isURL(githubURL, { require_protocol: true })) {
    throw new Error("github url is not valid");
  }
  if (
    leetcodeURL &&
    !validator.isURL(leetcodeURL, { require_protocol: true })
  ) {
    throw new Error("leetcode url is not valid");
  }
  if (
    instagramURL &&
    !validator.isURL(instagramURL, { require_protocol: true })
  ) {
    throw new Error("instagram url is not valid");
  }
  if (skills && skills.length > 10) {
    throw new Error("only 10 skills are allowed");
  }
};

module.exports = { validateAndSanitizeLoginData, validateProfileSetup };
