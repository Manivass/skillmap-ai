const express = require("express");
const { validateAndSanitizeLoginData } = require("../validation/validate");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  try {
    await validateAndSanitizeLoginData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await newUser.save();

    const token = jwt.sign({ emailId }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      expires: new Date(Date.now() + 60 * 60 * 1000 * 36),
    });
    res.status(201).json({
      success: true,
      message: "successfully signed Up",
      data: {
        firstName,
        lastName,
        emailId,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = userRouter;
