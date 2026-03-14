import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import cloudinary from "../lib/cloudinary.js"

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "password does not match" });
    }
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        {expiresIn:"7d"}
    )
    res.cookie("token", token, {
        httpOnly: true,
        secure:false
    })
    res.status(200).json({
        message: "login successful",
       user: { _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic
    },
        token
    })
}
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const existingUser =await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            fullName,
            email,
            password:hashedPassword
        })
        await user.save();
        res.status(200).json({
            message: "User created successfully",
              user: {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profilePic: user.profilePic
  }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
export const logout = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            expires:new Date(0)
        })
        res.status(200).json({ message: "logout successfully" });
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
export const updateProfile = async (req, res) => {
    try {
      console.log("route hit")
        const { profilePic } = req.body;
        console.log("image received");

        const userId = req.user.userId;
        
    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

      const uploadResponse = await cloudinary.uploader.upload(profilePic);
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth =async (req, res) => {
  try {
      const user = await User.findById(req.user.userId).select("-password");
      
      res.status(200).json(user)
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};