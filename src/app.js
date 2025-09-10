const express = require("express");
const app = express();
require("./config/database");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const validator = require("validator");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  const userEmail = req.body.emailID;
  const userPassword = req.body.password;

  try {
    if (!validator.isEmail(userEmail)) {
      throw new Error("Invalid Email" + userEmail);
    }
    if(!validator.isStrongPassword(userPassword)){
      throw new Error("Your Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.")
    }
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});
//now we have users in our DB

//getting a single user from DB
app.get("/user", async (req, res) => {
  const userName = req.body.firstName;

  const user = await User.find({ firstName: userName });

  try {
    if (user.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.send("Something went wrong" + err.message);
  }
});

//getting all users from DB
app.get("/feed", async (req, res) => {
  const users = await User.find({});

  try {
    if (users.length === 0) {
      res.status(404).send("Users not exist!!");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.send("Something went wrong" + err.message);
  }
});

//Deleting user from DB

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  const user = await User.findByIdAndDelete(userId);
  try {
    res.send(user + "Deleted Sucessfully");
  } catch (err) {
    ("something went wrong");
  }
});

//updating name of a user , finding them by id

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["photoURL", "about", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data.skills && data.skills.length > 10) {
      throw new Error("Skills can not be more than 10");
    }
    if (data.about && data.about.length > 200) {
      throw new Error("About section too long");
    }

     if (!validator.isNumeric(data?.age.toString())) {
      throw new Error("Age must be in numbers");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });

    res.send(user + "This User Upgraded Successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(3000, () => {
      console.log("app is listning at http://localhost:3000 ");
    });
  })
  .catch((err) => {
    console.error("Database can not be connected", err.message);
  });
