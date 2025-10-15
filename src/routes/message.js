const express = require("express");
const { ConnectionRequest } = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const { Message } = require("../models/message");
const { upload } = require("../middlewares/upload");
const { User } = require("../models/user");

const messageRouter = express.Router();

// Get users in chatBox (connections + users with message history)
messageRouter.get("/message/connections", userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user

        // Get accepted connections
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

        // Extract connection user IDs
        const connectionUserIds = new Set();
        const connections = connectionRequests.map((req) => {
          const otherUser = req.toUserId._id.toString() === loggedInUser._id.toString() 
            ? req.fromUserId 
            : req.toUserId;
          connectionUserIds.add(otherUser._id.toString());
          return otherUser;
        });

        // Find all messages involving the logged-in user
        const messages = await Message.find({
          $or: [
            { senderId: loggedInUser._id },
            { receiverId: loggedInUser._id }
          ]
        }).sort({ createdAt: -1 });

        // Get unique user IDs from messages who are NOT in connections
        const messageUserIds = new Set();
        messages.forEach(msg => {
          const otherUserId = msg.senderId.toString() === loggedInUser._id.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString();
          
          // Only add if not already a connection
          if (!connectionUserIds.has(otherUserId)) {
            messageUserIds.add(otherUserId);
          }
        });

        // Fetch user details for non-connection message users
        const messageUsers = await User.find({
          _id: { $in: Array.from(messageUserIds) }
        }).select("firstName age about skills photoURL");

        // Combine connections and message users
        const allChatUsers = [...connections, ...messageUsers];

        res.json({
          message: `Hey ${loggedInUser.firstName}, your Chats:`,
          requests: allChatUsers,
        });
    } catch (err) {
        console.log("Error in get message connections route:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get Messages between logged-in user and another user
messageRouter.get("/message/:userToChatId", userAuth, async(req,res) => {
    try{
        const {userToChatId} = req.params
        const loggedInUserId = req.user._id

        const messages = await Message.find({
            $or:[
                {senderId: loggedInUserId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: loggedInUserId}
            ]
        }).sort({ createdAt: 1 }) // Sort by oldest first

        res.status(200).json(messages)
    }catch (err) {
        console.log("Error in get Messages route:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
})

// Send Message Route (with optional image)
messageRouter.post("/message/:receiverId", userAuth, upload.single("image"), async (req, res) => {
  try {
    const { text } = req.body;
    const { receiverId } = req.params;
    const senderId = req.user._id;

    // Validate that at least text or image is provided
    if (!text && !req.file) {
      return res.status(400).json({ error: "Message must contain text or image" });
    }

    // Verify receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    const imageUrl = req.file?.path; // Cloudinary image URL from multer storage

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Populate sender info for response
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "firstName photoURL")
      .populate("receiverId", "firstName photoURL");

    //todo: socket.io logic will be written here 

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.log("Error in sendMessage route:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = messageRouter;