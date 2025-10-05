const express = require("express");
const authRouter = express.Router();
const multer = require("multer");
const { User } = require("../models/user");
const { validateSignUpData } = require("../utils/Validation");
const bcrypt = require("bcrypt");
const path = require("path");
const { upload } = require("../middlewares/upload");

authRouter.post("/signup", async (req, res) => {
  upload.single("image")(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res
        .status(400)
        .json({
          success: false,
          message: "❌ Please upload a photo less than 3MB",
        });
    } else if (err) {
      return res
        .status(400)
        .json({ success: false, message: `❌ Upload Error: ${err.message}` });
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
      //validation of data
      validateSignUpData(req);

      //encrypt the password
      const passwordHash = await bcrypt.hash(password, 8);

      //create new instance of User Model
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
        // photoURL:'images/'+ req.file.filename
      });

      await user.save();

      const token = await user.getJWT();
      res.cookie("token", token);

      res.status(201).json({ user: user });
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

    // Set secure cookie for production
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none", // required for cross-origin cookies
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("logout Successful");
});

module.exports = authRouter;
