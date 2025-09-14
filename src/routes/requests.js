const express = require("express")
const requestRouter = express.Router()

const {userAuth} = require("../middlewares/auth")

requestRouter.get("/connectionrequests", userAuth, (req,res) => {
    try{
       const user = req.user
    if(!user){
        throw new Error("user not found")
    }
    res.send(user + "Sent an connection request")
    }catch(err){

        res.status(404).send(err.message)

    }
    
    
})



module.exports = requestRouter;