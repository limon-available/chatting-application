import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/Message.js";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://chatting-application-63as.vercel.app"
    ],
    credentials:true
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {}; 

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (!userId) {
  console.log("No userId → disconnect");
    return socket.disconnect(true);
}
  userSocketMap[userId] = socket.id;

console.log(userSocketMap)
    socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];

    if (receiverSocketId) {
        io.to(receiverSocketId).emit("userTyping", {
      senderId: socket.handshake.query.userId,
    });
    }

    });
  
  socket.on("stopTyping", ({ receiverId }) => {
  const receiverSocketId = userSocketMap[receiverId];

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("userStopTyping", {
      senderId: socket.handshake.query.userId,
    });
  }
});

  socket.on("messageDelivered", async({ messageId, senderId }) => {
      await Message.findByIdAndUpdate(messageId, {
    delivered: true
  });
  const senderSocketId = userSocketMap[senderId];

  if (senderSocketId) {
    io.to(senderSocketId).emit("messageDelivered", { messageId });
  }
  });
  

  socket.on("messageSeen", async({ messageId, senderId }) => {
    await Message.findByIdAndUpdate(messageId, {
    seen: true
  });
  const senderSocketId = userSocketMap[senderId];

  if (senderSocketId) {
    io.to(senderSocketId).emit("messageSeen", { messageId });
  }

  });
  
  
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };