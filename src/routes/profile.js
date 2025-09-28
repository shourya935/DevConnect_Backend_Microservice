const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");

const { userAuth } = require("../middlewares/auth");
const {
  validateEditProfileData,
  validateSignUpData,
} = require("../utils/Validation");
const validator = require("validator");

const {upload} = require("../middlewares/upload")
const path = require("path")
const multer = require("multer")

profileRouter.get("/profile/veiw", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

profileRouter.patch(
  "/profile/edit",
  userAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const loggedInUser = req.user;

      if (!validateEditProfileData(req)) {
        throw new Error("Invalid profile update data.");
      }

      // Extract updatable fields
      const updatableFields = ["firstName", "age", "about", "skills"];
      updatableFields.forEach((field) => {
        if (req.body[field]) {
          loggedInUser[field] = req.body[field];
        }
      });

      // If a new profile image is uploaded
      if (req.file && req.file.path) {
        loggedInUser.photoURL = req.file.path; // Cloudinary gives full URL in `path`
      }

      await loggedInUser.save();

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: loggedInUser,
      });
    } catch (err) {
      console.error("Edit Profile Error:", err.message);
      return res.status(400).json({
        success: false,
        message: err.message || "Profile update failed",
      });
    }
  }
);

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { oldPassword, newPassword, confirmPassword  } = req.body;
    let savedHashPassword = loggedInUser.password;
    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      savedHashPassword
    );

    if (!isPasswordValid) {
      throw new Error("Incorrect Password");
    }

    if (!validator.isStrongPassword(newPassword)) {
      throw new Error(
        "Your Password must be at least 8 characters and include uppercase, lowercase, number, and symbol."
      );
    }

    if(confirmPassword != newPassword){
      throw new Error (
        "Password does not match"
      )
    }

    const newHashPassword = await bcrypt.hash(newPassword, 8);

    loggedInUser.password = newHashPassword;

    res.send("Your Password has been upgraded successfully");

    await loggedInUser.save()
  } catch (err) {
    res.status(404).send("Error:" + err.message);
  }
});

module.exports = profileRouter;
