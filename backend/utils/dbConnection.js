import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
    } catch (error) {
        console.log("cannot connect database");
    }
}

export default connectDb;