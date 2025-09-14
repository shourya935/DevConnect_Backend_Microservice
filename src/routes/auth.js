const express = require("express");
const authRouter = express.Router();

const { User } = require("../models/user");
const { validateSignUpData } = require("../utils/Validation");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
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

authRouter.post ("/login", async (req, res) => {
  const {emailID,password} = req.body;
  
  
  try{
   //email validation
    const user = await User.findOne({emailID: emailID})
  if(!user){
    throw new Error("❌ Email ID does not exist. Please register first.")
  }
  //password validation
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
  
});

// authRouter.post("/logout", (req,res) => {
//   res.clearCookie("token")
//   res.status(200).json({message:"Logged out "})
// })

authRouter.post("/logout", (req,res) => {
  res.cookie("token",null,{
    expires: new Date(Date.now()),
  })
})




module.exports = authRouter;