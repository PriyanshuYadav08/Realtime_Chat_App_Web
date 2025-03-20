import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {

    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "5d",
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 5 * 24 * 60 * 60 * 1000,
    });
};