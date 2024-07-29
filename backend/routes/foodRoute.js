import express from "express";
import { addFood, listFood,removeFood } from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

// Image storage Engine
const storage = multer.diskStorage({
    destination:"uploads",
    filename: (req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})

// GET
// All foods
foodRouter.get("/list",listFood)

// POST
//add food
foodRouter.post("/add",upload.single("image"),addFood)
//remove food
foodRouter.post("/remove",removeFood)

export default foodRouter;