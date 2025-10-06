const express = require("express");
const authRouter = express.Router();
const multer = require("multer");
const { User } = require("../models/user");
const { validateSignUpData } = require("../utils/Validation");
const bcrypt = require("bcrypt");
const path = require("path");
const { upload } = require("../middlewares/upload");

// Handle Sign Up
authRouter.post("/signup", async (req, res) => {
  upload.single("image")(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: "❌ Please upload a photo less than 3MB",
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: `❌ Upload Error: ${err.message}`,
      });
    }

    const {
      firstName,
      lastName,
      emailID,
      password,
      about,
      skills,
      age,
      gender,
    } = req.body;

    const imageUrl = req.file?.path;

    try {
      validateSignUpData(req);

      const passwordHash = await bcrypt.hash(password, 8);

      const user = new User({
        firstName,
        lastName,
        emailID,
        about,
        password: passwordHash,
        skills,
        age,
        gender,
        photoURL: imageUrl,
      });

      await user.save();

      const token = await user.getJWT();

      res.json({
        success: true,
        user,
        token, // Send token to frontend
      });
    } catch (err) {
      if (err.code === 11000 && err.keyPattern?.emailID) {
        return res.status(400).json({
          success: false,
          message:
            "Entered Email Address is already registered. Try logging in instead or use a different email address",
        });
      }

      res.status(400).json({ success: false, message: err.message });
    }
  });
});

// Handle Login
authRouter.post("/login", async (req, res) => {
  const { emailID, password } = req.body;

  try {
    const user = await User.findOne({ emailID });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "❌ Email ID does not exist. Please register first.",
      });
    }

    const isPasswordValid = await user.ValidatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "!! Incorrect Password please try again",
      });
    }

    const token = await user.getJWT();

    res.json({
      success: true,
      user,
      token, // Send token to frontend
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Handle Logout
authRouter.post("/logout", (req, res) => {
  // No need to clear cookies anymore
  // Frontend will handle localStorage.removeItem('authToken')
  res.json({ success: true, message: "Logout successful" });
});

module.exports = authRouter;
