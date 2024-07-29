import mongoose from "mongoose";

export const connectDB = async() => {
    await mongoose.connect('mongodb://mael:SuperPass2606f@127.0.0.1:27017/FoodDelDatabase')
        .then(() => console.log("DB connected"))
        .catch(err => console.error("Connection error", err));
}
