import chatModel from "../../models/chatModel.js";
import messageModel from "../../models/messageModel.js";

export const deleteChatService = async (chatId, userId) => {
  const chat = await chatModel.findById(chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  if (chat.userId.toString() !== userId.toString()) {
    throw new Error("Access denied. You do not have access to this chat.");
  }

  await messageModel.deleteMany({ chatId: chatId });

  await chat.deleteOne();
};
