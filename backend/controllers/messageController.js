import asyncHandler from "express-async-handler";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";

// ✅ Get all messages
export const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate({
        path: "chat",
        populate: {
          path: "users",
          select: "name pic email",
        },
      });

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});


// ✅ Send message
export const sendMessage = asyncHandler(async (req, res) => {
  
  const { content, chatId, fileUrl, isFile } = req.body;

  if (!chatId) {
    return res.status(400).send("Invalid data");
  }

  let message = await Message.create({
    sender: req.user._id,
    content,
    chat: chatId,
    fileUrl: fileUrl,   // ADD
    isFile: isFile,     // ADD
  });

  // Populate sender
  message = await message.populate("sender", "name pic");

  // 🔥 IMPORTANT: Deep populate chat + users
  message = await message.populate({
    path: "chat",
    populate: [
      {
        path: "users",
        select: "name pic email",
      },
      {
        path: "groupAdmin",
        select: "name pic email",
      },
    ],
  });

  // Update latest message
  await Chat.findByIdAndUpdate(chatId, {
    latestMessage: message,
  });

  res.status(200).json(message);
});