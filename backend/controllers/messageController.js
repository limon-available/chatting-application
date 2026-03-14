import Message from "../models/Message.js";
import User from "../models/User.js"
export const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;

    const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(users);
  } catch (error) {
      console.log("in get users controller",error)
    res.status(500).json({ message: "Server error" });
  }
};
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const {receiverId
    } = req.params;
        
        const senderId = req.user.userId;
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image
        })
        await newMessage.save();
        res.status(201).json({ newMessage });
    } catch (error) {
        console.log("in send message controller",error)
        res.status(500).json({ message: error.message });
    }
}
export const getMessages = async (req, res) => {
    try {
        const senderId = req.user.userId;
        const { receiverId } = req.params;
        
        console.log("senderId", senderId);
        console.log("receiverId", receiverId);
        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 });
        res.status(200).json({messages})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const markMessagesSeen = async (req, res) => {
  const { id } = req.params;

  await Message.updateMany(
    { senderId: id, receiverId: req.user.userId, seen: false },
    { $set: { seen: true } }
  );

  res.status(200).json({ success: true });
};