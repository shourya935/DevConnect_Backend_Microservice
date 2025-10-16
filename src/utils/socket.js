const { Server } = require("socket.io");
const http = require("http")
const express = require("express"); 


const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
})

 function getReceiverSocketId(userId) {
    return userSocketMap[userId]
}

// used to store  online users 
const userSocketMap = {} // object with key and value-:{userId : socketId}

io.on("connection", (socket)=> {
    console.log("A User connected", socket.id)

    const userId = socket.handshake.query.userId
    if(userId) userSocketMap[userId] = socket.id

    // io.emit is used to send event to all connected  user (io.emit Broadcast's an event )
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})



module.exports = {io, app, server, getReceiverSocketId }