const express = require("express");
const app = express();
require("./config/database");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const validator = require("validator");
const { validateSignUpData } = require("./utils/Validation");
const bcrypt = require("bcrypt");
const cookie = require("cookie")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const {userAuth} = require("./middlewares/auth")

app.use(express.json());
app.use(cookieParser())

app.post("/signup", async (req, res) => {
  const {firstName,lastName,emailID,password} = req.body
  
  try {
    //validation of data
  validateSignUpData(req)

  //encrypt the password
  const passwordHash = await bcrypt.hash(password,10)
  
  //create new instance of User Model
   const user = new User({
    firstName,
    lastName,
    emailID,
    password:passwordHash,
   });
   
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post ("/login", async (req, res) => {
  const {emailID,password} = req.body;
  
  
  try{

    const user = await User.findOne({emailID: emailID})
  if(!user){
    throw new Error("❌ Email ID does not exist. Please register first.")
  }

  const isPasswordValid = await user.ValidatePassword(password)
  if(!isPasswordValid){
    throw new Error("!! Incorrect Password please try again")
  }
  //if login successful
  //create a JWT Token
  const token = await user.getJWT()
  console.log(token)

  //Add token to cookie and send response back to user
  res.cookie("token",token);//cookie sent to client 
  
  res.send("Login Successful")

  }catch(err){
    res.status(404).send(err.message)
  }
  
} )

app.get("/profile", userAuth, async (req,res) => {
  try{
  const user = req.user
  res.send(user)
  }catch(err){
    res.status(404).send(err.message)
  }
})


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
