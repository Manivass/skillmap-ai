const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw new Error("please Login!!");
  }
  const userId = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const isUserAvailable = await User.findById(userId);

  if (!isUserAvailable) {
    throw new Error("user not found");
  }

  req.user = isUserAvailable;
  next();
};

module.exports = userAuth;
