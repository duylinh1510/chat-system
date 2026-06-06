import { Server } from 'socket.io';
import http from "http";
import express from 'express';
import { socketAuthMiddleware } from '../middlewares/socketMiddleware.js';
import { getUserConversationsForSocketIO } from '../controllers/conversationController.js';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
});

io.use(socketAuthMiddleware);

const onlineUsers = new Map(); // {key - userId, value - socketId} ứng dụng lớn thì xài Redis



io.on("connection", async (socket) => {
    const user = socket.user;
    console.log(`${user.displayName} is online with socket: ${socket.id}`);

    onlineUsers.set(user._id, socket.id);

    io.emit("online-users", Array.from(onlineUsers.keys()));

    const conversationIds = await getUserConversationsForSocketIO(user._id);
    conversationIds.forEach((id) => {
        socket.join(id);
    })

    //khi user tạo conversation mới thì server tự join vào phòng đó
    socket.on("join-conversation", (conversationId) => {
        socket.join(conversationId);
    });

    //tạo phòng theo userid
    socket.join(user._id.toString());

    //typing indicator
    socket.on("typing:start", ({ conversationId }) => {
        if (!conversationId) return;

        socket.to(conversationId).emit("typing:start", {
            conversationId,
            user: {
                _id: user._id,
                displayName: user.displayName,
            },
        });
    });

    socket.on("typing:stop", ({ conversationId }) => {
        if (!conversationId) return;

        socket.to(conversationId).emit("typing:stop", {
            conversationId,
            user: {
                _id: user._id,
                displayName: user.displayName,
            },
        });
    });

    socket.on("disconnect", () => {
        onlineUsers.delete(user._id);
        io.emit("online-users", Array.from(onlineUsers.keys()));
        console.log(`Socket disconnected: ${socket.id}`)
    });
});

export { io, app, server };