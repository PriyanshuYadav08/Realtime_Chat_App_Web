import jwt from 'jsonwebtoken';
import { User } from '../models/user.models.js';

export const protectRoute = async (req, res, next) => {
    try {
      const token = req.cookies.jwt;
      
      if (!token) {
        return res.status(401).json({ message: "Unauthorised - Token Unavailable" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      console.log("Decoded JWT =", decoded); // 🔍 Log the decoded token
  
      if (!decoded || !decoded.id) {
        return res.status(401).json({ message: "Unauthorised - Invalid Token Payload" });
      }
  
      const user = await User.findById(decoded.id).select("-password");
  
      if (!user) {
        console.log("No user found for ID =", decoded.id); // 🔍 Log failed lookup
        return res.status(404).json({ message: "User not found" });
      }
  
      req.user = user;
      next();
    } catch (error) {
      console.error("Error in middleware =", error.message || error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  