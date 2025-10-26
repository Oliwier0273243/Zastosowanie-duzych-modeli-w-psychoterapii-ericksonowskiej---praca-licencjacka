import chatModel from "../../models/chatModel.js";

export const patchChatService = async (chatId, updates, userId) => {
  const chat = await chatModel.findById(chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  if (chat.userId.toString() !== userId.toString()) {
    throw new Error("Access denied. You do not own this chat.");
  }

  Object.assign(chat, updates);
  return await chat.save();
};
