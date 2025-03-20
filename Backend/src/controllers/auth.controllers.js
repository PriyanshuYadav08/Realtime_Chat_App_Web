import User from "../models/user.models.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {

    const { email, fullName, password } = req.body;
    
    try{
        if (!email || !password || !fullName) {
            return res.status(400).json({message: "All fields are required"});
        }

        if (password.length < 7) {
            return res.status(400).json({message: "Password must be at least 7 characters long"});
        }
        const user = await User.findOne({email});
        if(user) return res.status(400).json({message: "Email already exists"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            fullName,
            password: hashedPassword
        });

        if (newUser){
            //we can generate a JWT token here
            const token = generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                profilePic: newUser.profilePic
            });
        } else{
            res.status(400).json({message: "Invalid User Data"});
        }

    } catch (error) {
        console.log("Error in signing in: ", error);
        res.status(500).json({message: "Server Error"});
    }
};

export const login = (req, res) => {
    res.send("login Route");
};

export const logout = (req, res) => {
    res.send("logout Route");
};