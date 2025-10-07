const express = require("express");
const { ConnectionRequest } = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const { Message } = require("../models/message");
const { upload } = require("../middlewares/upload");

const messageRouter = express.Router();

//get users in chatBox 
messageRouter.get("/message/connections", userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user

        const connectionRequests = await ConnectionRequest.find({
      status: "accepted",
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    })
      .populate("fromUserId", [
        "firstName",
        "age",
        "about",
        "skills",
        "photoURL",
      ])
      .populate("toUserId", [
        "firstName",
        "age",
        "about",
        "skills",
        "photoURL",
      ]);

    // Extract only the other user in each connection
    const connections = connectionRequests.map((req) => {
      // If logged-in user is the receiver, return sender
      if (req.toUserId._id.toString() === loggedInUser._id.toString()) {
        return req.fromUserId;
      } else {
        return req.toUserId;
      }
    });

    res.json({
      message: `Hey ${loggedInUser.firstName}, your Connections:`,
      requests: connections,
    });
  } catch (err) {
    console.log("Error in get message conntions route:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
} )

module.exports = messageRouter

//get Messages
messageRouter.get("/message/:userToChatId", userAuth, async(req,res) => {
    try{
        const {userToChatId} = req.params
        const loggedInUserId = req.user._id

        const messages = await Message.find({
            $or:[
                {senderId: loggedInUserId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: loggedInUserId}
            ]
        })

        res.status(200).json(messages)
    }catch (err) {
    console.log("Error in get Messages route:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
})

// Send Message Route (with optional image)
messageRouter.post("/message/:receiverId", userAuth, upload.single("image"), async (req, res) => {
  try {
    const { text } = req.body;
    const { receiverId } = req.params;
    const senderId = req.user._id;

    const imageUrl = req.file?.path; // Cloudinary image URL from multer storage

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

  //todo: socket.io logic will be written here 

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage route:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});