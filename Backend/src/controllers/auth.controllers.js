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
    console.error("Error in signing up:", error.message || error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const login = (req, res) => {
  console.log("Login Route");
  res.send("Login Route");
};

export const logout = (req, res) => {
  console.log("Logout Route");
  res.send("Logout Route");
};