import express from "express";
import dotenv from "dotenv";
dotenv.config()

import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./utils/dbConnection.js";
import authRoute from "./routes/authRoute.js";
import messageRoutes from "./routes/messageRoute.js";
import { app, server } from "./lib/socket.js";
 
app.use(express.json({ limit: "10 mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}));

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoutes);
app.get("/", (req, res) => {
    console.log("server created");
    res.send("server created successfully");
})
connectDb();

server.listen(5000, () => {
    console.log(`server running on port`, 5000);
})