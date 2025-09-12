// user Authentication Middleware
const { User } = require("../models/user");
const jwt = require("jsonwebtoken")

const userAuth = async (req,res,next) => {
    try{
        //validate the user
        const {token} = req.cookies
        if(!token){
            throw new Error("Invalid token Please LogIn Again")
        }
        const decoded = jwt.verify(token,"Devtinder$qwer")

        const {_id} = decoded

        const user = await User.findById(_id)

        if(!user){
            throw new Error("user not found!! please first register yourself")
        }
        req.user = user
        next()

    }catch(err){
        res.status(404).send("ERROR:" + err.message)
    }
}

module.exports = {
    userAuth
}