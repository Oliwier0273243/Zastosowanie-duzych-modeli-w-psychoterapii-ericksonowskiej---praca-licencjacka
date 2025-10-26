import chatModel from "../../models/chatModel.js";

export const getChatService = async (chatId, userId) => {
  const chat = await chatModel.findById(chatId).populate("patientIds");

  if (!chat) {
    throw new Error("Chat not found");
  }

  if (chat.userId.toString() !== userId.toString()) {
    throw new Error("Access denied. You do not have access to this chat.");
  }

  return chat;
};
