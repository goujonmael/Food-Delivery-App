import mongoose, { mongo } from "mongoose";

//Food schema
const foodSchema = new mongoose.Schema({
    name: {type: String, required:true},
    description: {type:String,required:true},
    price: {type:Number,required:true},
    image: {type:String,required:true},
    category: {type:String, required:true}
})

//Food model
//Use "mongoose.model.food" model if it exist, else create a new one
const foodModel = mongoose.model.food || mongoose.model("food",foodSchema);

export default foodModel;