const express = require("express");
const authRouter = express.Router();
const multer = require("multer")
const { User } = require("../models/user");
const { validateSignUpData } = require("../utils/Validation");
const bcrypt = require("bcrypt");
const path = require("path")
const {upload} = require("../middlewares/upload")




authRouter.post("/signup", async (req, res) => {
  upload.single("image")(req, res, async function (err) {

     if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: "❌ Please upload a photo less than 3MB" });
    } else if (err) {
      return res.status(400).json({ success: false, message: `❌ Upload Error: ${err.message}` });
    }

  const {firstName,lastName,emailID,password,about,skills,age,gender} = req.body

   const imageUrl = req.file?.path;
  
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
    about,
    password:passwordHash,
    skills,
    age,
    gender,
    photoURL:imageUrl
    // photoURL:'images/'+ req.file.filename
   });
   
    await user.save();
     res.status(201).json({ success: true, user });

  } catch (err) {
     res.status(400).json({ success: false, message: err.message });

  }
  })
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
  
  res.send(user)
 
  }catch(err){
    res.status(404).send(err.message)
  }
  
});


authRouter.post("/logout", (req,res) => {
  res.cookie("token",null,{
    expires: new Date(Date.now()),
   
  })
   res.send("logout Successful")
})


module.exports = authRouter;