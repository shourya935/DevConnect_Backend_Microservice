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

       const allowedStatus = ["ignored", "interested"]
       if(!allowedStatus.includes(status)){
        throw new Error("Invalid Status")
       }

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

requestRouter.post("/request/review/:status/:requestId",
     userAuth, async (req, res) => {
        try{
            const loggedInUser = req.user;
            const {status, requestId} = req.params;
            

            const allowedStatus = ["accepted", "rejected"]
            if(!allowedStatus.includes(status)){
                throw new Error("Invalid Status!!")
            }

            const connectionRequest = await ConnectionRequest.findOne({
                _id:requestId,
                toUserId:loggedInUser._id,
                status: "interested"
            })

            if(!connectionRequest){
                throw new Error("Connection request not found")
            }

            connectionRequest.status = status;

            const data = await connectionRequest.save()

            const {fromUserId} = connectionRequest;

            const fromUser = await User.findById(fromUserId)

            if(status === "accepted"){
                res.send("Hey " + loggedInUser.firstName + " you are now in connection with " + fromUser.firstName)
            }
            else{
                res.send("Hey " +loggedInUser.firstName+ " connection request of " + fromUser.firstName + " Has been rejected successfully")
            }
            

        }catch(err){
            res.send("Error:" + err.message)
        }
})





module.exports = requestRouter;