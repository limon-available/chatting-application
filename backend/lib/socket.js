import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
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
  if (userId) userSocketMap[userId] = socket.id;


    socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];

    if (receiverSocketId) {
        io.to(receiverSocketId).emit("userTyping", {
      senderId: socket.handshake.query.userId,
    });
    }

    });
  
  //messagedelivered

  socket.on("messageDelivered", ({ messageId, senderId }) => {
  const senderSocketId = userSocketMap[senderId];

  if (senderSocketId) {
    io.to(senderSocketId).emit("messageDelivered", { messageId });
  }
  });
  
  //messageseen
  socket.on("messageSeen", ({ messageId, senderId }) => {

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