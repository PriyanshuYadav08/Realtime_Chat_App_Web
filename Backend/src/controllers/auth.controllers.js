import User from "../models/user.models.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (typeof password !== 'string' || password.length < 7) {
      return res.status(400).json({ message: "Password must be at least 7 characters long" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);

    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      fullName: newUser.fullName,
      profilePic: newUser.profilePic,
      token,
    });
  } catch (error) {
    console.error("Error in signing up = ", error.message || error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if(!correctPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id,res);
    res.status(200).json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
      token,
    });

  } catch (error) {
    console.error("Error in logging in = ", error.message || error);
    res.status(500).json({ message: " Internal Server Error" }); 
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("token", "", {maxAge: 0});
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logging out = ", error.message || error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  
};