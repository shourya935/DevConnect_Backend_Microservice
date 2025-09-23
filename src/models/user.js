const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {SESSION_SECRET} = process.env
const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        maxLength: 15,
        validate(value){
            if(!validator.isAlpha(value)){
                throw new Error("Name should only contain alphabets")
            }
        }
    },
     lastName: {
        type: String,
        maxLength: 15,
        validate(value){
            if(!validator.isAlpha(value)){
                throw new Error("Name should only contain alphabets")
            }
        }
    },
     emailID: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        // validate(value){
        //     if(!validator.isEmail(value)){
        //         throw new Error("Invalid email address:" + value)
        //     }
        // }
    },
     password: {
        type: String,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Your Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.")
            }
        }
    },
    age:{
        type: Number,
        validate(value){
            if(!validator.isNumeric(value.toString())){
                throw new Error("Age Should be in numbers")
            }
        }
    },
     gender: {
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value.toLowerCase())){
                throw new Error("Gender data is not valid Enter Male or female")
            }
        },
    },
    photoURL: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
       
    },
    about: {
        type: String,
    },
    skills:{
        type:[String]
    },
 

},
{
    timestamps: true,
}
);

userSchema.methods.getJWT = async function () {

    const user = this;

    const token = await jwt.sign({_id:user._id},SESSION_SECRET, { expiresIn: '7d' });

    return token;
}

userSchema.methods.ValidatePassword = async function (password){

    const user = this;

    const isPasswordValid = bcrypt.compare(password,user.password);

    return isPasswordValid;

}

const User = mongoose.model("User", userSchema)

module.exports = {User}