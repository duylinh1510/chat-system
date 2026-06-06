import { uploadImageFromBuffer } from '../middlewares/uploadMiddleware.js';
import User from '../models/User.js'

export const authMe = async (req, res) => {
    try {
        const user = req.user; // lấy từ authMiddleware

        return res.status(200).json({ user })
    } catch (error) {
        console.error('Error AuthMe', error);
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const searchUserByUsername = async (req, res) => {
    try {
        const { username } = req.query;

        if (!username || username.trim() === "") {
            return res.status(400).json({ message: "username not provided" })
        }

        const user = await User.findOne({ username }).select("_id displayName avatarUrl");

        return res.status(200).json({ user });
    } catch (error) {
        console.error("Errow while searchUserByUsername", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const uploadAvatar = async (req, res) => {
    try {
        //req.file là do middleware cung cấp
        const file = req.file;
        const userId = req.user;

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" })
        }

        const result = await uploadImageFromBuffer(file.buffer);

        const updatedUser = await User.findByIdAndUpdate(userId, {
            avatarUrl: result.secure_url,
            avatarId: result.public_id,
        }, { new: true }).select("avatarUrl");

        if (!updatedUser.avatarUrl) {
            return res.status(400).json({ message: "Avatar return null" })
        }

        return res.status(200).json({ avatarUrl: updatedUser.avatarUrl });

    } catch (error) {
        console.error("Error while uploading avatar to Cloudinary", error);
        return res.status(500).json({ message: "Failed to upload avatar" })
    }
}