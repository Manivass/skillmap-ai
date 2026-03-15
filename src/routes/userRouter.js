const express = require("express");
const { validateAndSanitizeLoginData } = require("../validation/validate");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();
const { OAuth2Client } = require("google-auth-library");
const userAuth = require("../middleware/userAuth");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

    const token = await newUser.getJWT();

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

userRouter.post("/google-login", async (req, res) => {
  try {
    const { token, provider } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const user = ticket.getPayload();
    const email = user.email;
    const firstName = user.given_name;
    const lastName = user.family_name;

    let isUserAvailable = await User.findOne({ emailId: email });
    if (!isUserAvailable) {
      isUserAvailable = new User({
        firstName,
        lastName,
        emailId: email,
        provider,
      });
      await isUserAvailable.save();
    }
    const jwtToken = await isUserAvailable.getJWT();

    res.cookie("token", jwtToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 1000 * 24),
    });

    res.status(200).json({ success: true, message: "Successfully logged In" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const isUserAvailable = await User.findOne({ emailId });
    if (!isUserAvailable) {
      return res
        .status(403)
        .json({ success: false, message: "invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      isUserAvailable.password,
    );

    if (!isPasswordCorrect) {
      return res
        .status(403)
        .json({ success: false, message: "invalid credentials" });
    }

    const token = await isUserAvailable.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    res.status(200).json({ status: true, message: "successfully logged in" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = userRouter;
