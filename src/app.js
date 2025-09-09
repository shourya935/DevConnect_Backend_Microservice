const express = require("express");
const app = express();
require("./config/database");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  // creating a new instance of User model

  const user = new User(req.body); //req.body has JSON payload conataining user info wich is comming from client

  try {
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
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
