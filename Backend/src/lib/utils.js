import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {

    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "5d",
    });

    res.cookie("token", token, { //this will be a httpOnly cookie, hence accessible only by the server
        //and more secure
        httpOnly: true,
        secure: process.env.NODE_ENV != "development",
        maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days in milliseconds
        sameSite: "strict",
    });

    return token;
};