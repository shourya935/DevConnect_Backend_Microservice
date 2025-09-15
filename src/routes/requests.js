const express = require("express")
const requestRouter = express.Router()

const {userAuth} = require("../middlewares/auth")
const {ConnectionRequest} = require("../models/connectionRequest")// Connection Req Model
const { User } = require("../models/user");//user model


requestRouter.post("/request/send/:status/:toUserId",
     userAuth, async (req,res) => {
    try{
       const fromUserId = req.user._id//from userAuth
       const toUserId = req.params.toUserId//from request URL
       const status = req.params.status 

       const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status
       })

       const toUser = await User.findById(toUserId)
       if(!toUser){
        throw new Error("User Does not exists!!")
       }

       const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
            {fromUserId, toUserId},
            {fromUserId: toUserId, toUserId:fromUserId}
        ]
       })
      if(existingConnectionRequest){
        throw new Error("Request Already Exists!!")
      }
      
       const data = await connectionRequest.save()

       

       res.send("Connection request sent to:" + toUser.firstName)
    
    }catch(err){

        res.status(404).send("Error:" + err.message)

    }
    
    
})



module.exports = requestRouter;