import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// login user
const loginUser = async (req, res) => {
}

// create token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// register user
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        // check if user already exists
        const exist = await userModel.findOne({ email});
        if (exist) {
            return res.json({ success: false, message: "User already exists" });
        }
        // email format and strength check
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        // save user
        const user = await newUser.save();
        // create token
        const token = createToken(user._id);
        res.json({ success: true, token});
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Server error" });        
    }
}

export { loginUser, registerUser };