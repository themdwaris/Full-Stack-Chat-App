import express from "express";
import { Server } from "socket.io";
import http from "http";
import getUserDetails from "../helpers/getUserDetailsFromToken.js";
import userModel from "../models/userModel.js";
import { chatModel, messageModel } from "../models/chatModel.js";
import mongoose from "mongoose";
import { getConversation } from "../helpers/getConversation.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://chatappbymd.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});


const onlineUser = new Set();

io.on("connection", async (socket) => {
  console.log("User connected", socket?.id);
  const token = socket?.handshake?.auth?.token;

  if (!token) {
    console.log("Token not provided. Disconnecting socket...");
    socket.disconnect();
    return;
  }
  // *************Current user details**************
  const user = await getUserDetails(token);

  // ************ Create a room *************

  socket.join(user?._id?.toString());
  onlineUser.add(user?._id?.toString());

  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("message-page", async (userId) => {
    try {
      const userDetails = await userModel.findById(userId).select("-password");
      const payload = {
        _id: userDetails?._id,
        name: userDetails?.name,
        email: userDetails?.email,
        avatar: userDetails?.avatar,
        online: onlineUser.has(userId),
      };
      socket.emit("message-user", payload);

      const getConversationMessage = await chatModel
        .findOne({
          $or: [
            { sender: user?._id, receiver: userId },
            { sender: userId, receiver: user?._id },
          ],
        })
        .populate("messages")
        .sort({ updatedAt: -1 });

      socket.emit("message", getConversationMessage?.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  });

  // new message

  socket.on("new-message", async (data) => {
    let conversations = await chatModel.findOne({
      $or: [
        {
          sender: data?.sender,
          receiver: data?.receiver,
        },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    });

    if (!conversations) {
      const createConversations = await chatModel({
        sender: data?.sender,
        receiver: data?.receiver,
      });
      conversations = await createConversations.save();
    }

    const messages = new messageModel({
      text: data?.text,
      imageUrl: data?.imageUrl,
      videoUrl: data?.videoUrl,
      messageByUserId: data?.messageByUserId,
    });
    const allMessages = await messages.save();

    const updateConversation = await chatModel.updateOne(
      { _id: conversations?._id },
      { $push: { messages: allMessages?._id } }
    );

    const getConversationMessage = await chatModel
      .findOne({
        $or: [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender },
        ],
      })
      .populate("messages")
      .sort({ updatedAt: -1 });

    io.to(data?.sender).emit("message", getConversationMessage?.messages || []);
    io.to(data?.receiver).emit(
      "message",
      getConversationMessage?.messages || []
    );

    // send conversation
    const conversationSender = await getConversation(data?.sender);
    const conversationReceiver = await getConversation(data?.receiver);

    io.to(data?.sender).emit("conversation", conversationSender);
    io.to(data?.receiver).emit("conversation", conversationReceiver);
  });

  // sidebar
  socket.on("sidebar", async (currentUserId) => {
    if (!mongoose.Types.ObjectId.isValid(currentUserId)) {
      return socket.emit("error", "Invalid user ID");
    }
    const conversation = await getConversation(currentUserId);
    socket.emit("conversation", conversation);
  });

  // seen
  socket.on("seen", async (messageByUserId) => {
    let conversation = await chatModel.findOne({
      $or: [
        {
          sender: user?._id,
          receiver: messageByUserId,
        },
        { sender: messageByUserId, receiver: user?._id },
      ],
    });

    const conversationId = conversation?.messages || [];

    const updateMessages = await messageModel.updateMany(
      { _id: { $in: conversationId }, messageByUserId: messageByUserId },
      { $set: { seen: true } }
    );

    // send conversation
    const conversationSender = await getConversation(user?._id?.toString());
    const conversationReceiver = await getConversation(messageByUserId);

    io.to(user?._id?.toString()).emit("conversation", conversationSender);
    io.to(messageByUserId).emit("conversation", conversationReceiver);
  });

  //disconnect
  socket.on("disconnect", () => {
    onlineUser.delete(user?._id?.toString());
    console.log("User disconnected", socket.id);
  });
});

export { app, server };
