const mongoose = require("mongoose");
const validator = require("validator")

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
        validate(value){//by default it is only applicable on post req and not applicable on patch req
            if(!["male","female","others"].includes(value.toLowerCase())){
                throw new Error("Gender data is not valid Enter Male or female");
            }
        },
    },
    photoURL: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Please enter valid URL")
            }
        }
    },
    about: {
        type: String,
    },
    skills:{
        type:[String]
    }

     


},
{
    timestamps: true,
}
);

const User = mongoose.model("User", userSchema)

module.exports = {User}