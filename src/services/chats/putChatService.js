import chatModel from "../../models/chatModel.js";

export const putChatService = async (chatId, newData, userId) => {
  const chat = await chatModel.findById(chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  if (chat.userId.toString() !== userId.toString()) {
    throw new Error("Access denied. You do not own this chat.");
  }

  const updatedChat = await chatModel.findByIdAndUpdate(
    chatId,
    { ...newData, userId },
    { new: true, overwrite: true, runValidators: true }
  );

  return updatedChat;
};
