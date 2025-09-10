const validator = require("validator");

const validateSignUpData = (req) => {
    const {firstName,lastName,emailID,password,skills,about} = req.body
    if(!firstName || !lastName){
        throw new Error("Make sure to enter first name and last name")
    } else if(!validator.isEmail(emailID)){
        throw new Error("Please enter valid Email Id")
    } else if(!validator.isStrongPassword(password)){
        throw new Error("Your Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.")
    } else if(skills && skills.length > 10 ){
        throw new Error ("Skills coloumn should not exseed 10 Skills")
    } else if(about && about.length > 300){
        throw new Error ("Your discription should be in less than 100 words")
    }
}

module.exports = {
    validateSignUpData
}