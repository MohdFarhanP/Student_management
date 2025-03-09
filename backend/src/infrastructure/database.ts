import mongoose, { connection } from "mongoose";

export const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONOGOURI as string);
        console.log('MongoDB Connected');
    }catch(error){
        console.log('MongoDB connection Failed:',error);
        process.exit(1);
    }
};