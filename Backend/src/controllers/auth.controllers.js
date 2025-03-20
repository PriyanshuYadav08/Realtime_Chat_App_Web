import User from "../models/user.models.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {

    const { email, password, fullName } = req.body;
    
    try{
        if (password.length < 7) {
            return res.status(400).json({message: "Password must be at least 7 characters long"});
        }
        const user = await User.findOne({email});
        if(user) return res.status(400).json({message: "Email already exists"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email: email, 
            password: hashedPassword, 
            fullName: fullName
        });

        if (newUser){
            //we can generate a JWT token here
            await newUser.save();
            res.status(201).json({message: "User Created Successfully"});
        } else{
            res.status(400).json({message: "Invalid User Data"});
        }

    } 
    
    catch (error) {
        console.log(error);
    }
};

export const login = (req, res) => {
    res.send("login Route");
};

export const logout = (req, res) => {
    res.send("logout Route");
};