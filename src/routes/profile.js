const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");

const { userAuth } = require("../middlewares/auth");
const {
  validateEditProfileData,
  validateSignUpData,
} = require("../utils/Validation");
const validator = require("validator");

profileRouter.get("/profile/veiw", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateSignUpData(req);
    if (!validateEditProfileData(req)) {
      throw new Error("Cant edit profile");
    }
  } catch (err) {
    res.status(404).send("Error: " + err.message);
  }

  const loggedInUser = req.user;
  console.log(loggedInUser); //userinfo before edit

  Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
  console.log(loggedInUser); //userinfo after edit

  await loggedInUser.save();

  res.send(loggedInUser.firstName + "Profile upgraded successfully");
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { oldPassword, newPassword } = req.body;
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

    const newHashPassword = await bcrypt.hash(newPassword, 10);

    loggedInUser.password = newHashPassword;

    res.send("Your Password has been upgraded successfully");

    await loggedInUser.save()
  } catch (err) {
    res.status(404).send("Error:" + err.message);
  }
});

module.exports = profileRouter;
