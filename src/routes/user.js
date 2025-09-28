const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "photoURL", "age", "skills", "about"]);

    res.json({
      message: `Hey ${loggedInUser.firstName}, your connection requests:`,
      requests: connectionRequest,
    });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      status: "accepted",
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    })
      .populate("fromUserId", ["firstName", "age", "about", "skills", "photoURL"])
      .populate("toUserId", ["firstName", "age", "about", "skills", "photoURL"]);

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
    res.status(400).send("Error:" + err.message);
  }
});

userRouter.get("/users/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId  toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    hideUsersFromFeed.add(loggedInUser._id.toString());

    const feedUsers = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeed) },
    })
      .select("firstName age about skills photoURL")
      .skip(skip)
      .limit(limit);

    res.json({
      message: "People you may Know :",
      request: feedUsers,
    });
 
  } catch (err) {
    res.send("Error:" + err.message);
  }
});

module.exports = userRouter;
