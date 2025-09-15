const express = require("express")
const userRouter = express.Router()

const {userAuth} = require("../middlewares/auth")
const {ConnectionRequest} = require("../models/connectionRequest")

userRouter.get("/user/requests/received", userAuth, async (req,res) =>{

    try{
        const loggedInUser = req.user

    const connectionRequest = await ConnectionRequest.find({
        toUserId : loggedInUser._id,
        status: "interested"
    }).populate("fromUserId", ["firstName","lastName"])

    res.json({
      message: `Hey ${loggedInUser.firstName}, your connection requests:`,
      requests: connectionRequest,
    });

    }catch(err){
        res.status(400).send("Error:"+ err.message)
    }

})

userRouter.get("/user/connections", userAuth, async (req,res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            status:"accepted",
            $or: [
                {toUserId:loggedInUser._id},
                {fromUserId:loggedInUser._id}
            ]
        })
        .populate("fromUserId",["firstName"])
        .populate("toUserId",["firstName"])

        // Extract only the other user in each connection
    const connections = connectionRequests.map(req => {
      // If logged-in user is the receiver, return sender
      if (req.toUserId._id.toString() === loggedInUser._id.toString()) {
        return req.fromUserId;
      } else {
        return req.toUserId;
      }
    });

        res.json({
            message:`Hey ${loggedInUser.firstName}, your Connections:`,
            requests: connections,
        })
    }catch(err){
        res.status(400).send("Error:" + err.message)
    }
})


module.exports = userRouter;