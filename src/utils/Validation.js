const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailID, password, skills, about, gender } = req.body;

  if (firstName !== undefined && !firstName) {
    throw new Error("First name cannot be empty");
  }

  if (lastName !== undefined && !lastName) {
    throw new Error("Last name cannot be empty");
  }

  if (gender !== undefined && !["male","female","others"].includes(gender.toLowerCase())){
    throw new Error("Error: Enter between male,female or others in gender section ")
  }

  if (emailID !== undefined && !validator.isEmail(emailID)) {
    throw new Error("Please enter a valid Email ID");
  }

  if (password !== undefined && !validator.isStrongPassword(password)) {
    throw new Error("Your Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.");
  }

  if (skills && skills.length > 10) {
    throw new Error("Skills column should not exceed 10 skills");
  }

  if (about && about.length > 300) {
    throw new Error("Your description should be less than 100 words");
  }
};


const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "emailID",
        "photoURL",
        "gender",
        "age",
        "about",
        "skills"
    ]
   const isEditAllowed = Object.keys(req.body).every((field) => 
    allowedEditFields.includes(field)
 )
 return isEditAllowed
}

module.exports = {
    validateSignUpData,
    validateEditProfileData
}