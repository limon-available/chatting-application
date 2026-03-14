import express from "express"
import authMiddleware from './../middleware/authMiddleware.js';
import { sendMessage,getMessages,getUsers, markMessagesSeen } from "../controllers/messageController.js";
const router = express.Router();

router.get("/users",authMiddleware,getUsers)
router.post("/send/:receiverId", authMiddleware, sendMessage);
router.get("/:receiverId", authMiddleware, getMessages);
router.put("/seen/:id",authMiddleware,markMessagesSeen)

export default router;