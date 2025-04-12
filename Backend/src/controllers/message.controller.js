import User from "../models/user.models.js";
import Message from "../models/message.models.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsers = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const currentUsers = await User.find({ _id: { $ne: loggedInUser } })
                                       .select("-password");
        res.status(200).json(currentUsers);
    } catch (error) {
        console.error("Error fetching users = ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const {id : userToChatWith} = req.params;
        const messengerId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderID: messengerId, receiverID: userToChatWith },
                { senderID: userToChatWith, receiverID: messengerId }
            ]
        });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in fetching messages = ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const senderID = req.user._id;
        const {id : receiverID} = req.params;

        let imageURL;
        if (image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageURL = uploadResponse.secure_url;
        }

        const newMessase = new Message({
            senderID,
            receiverID,
            text,
            image: imageURL
        });
        await newMessase.save();

        //realtime functionality to be added => socket.io
        res.status(201).json({ newMessase});
    } catch (error) {
        console.error("Error in sending message = ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};