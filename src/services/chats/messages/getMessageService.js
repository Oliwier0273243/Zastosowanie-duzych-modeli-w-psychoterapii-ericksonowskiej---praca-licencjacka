import messageModel from "../../../models/messageModel.js";
import chatModel from "../../../models/chatModel.js";

export const getMessageService = async (userId, identifier) => {
  let message;
  if (identifier && typeof identifier === "object") {
    const { chatId, messageIndex } = identifier;
    message = await messageModel.findOne({ chatId, messageIndex });
  } else {
    message = await messageModel.findById(identifier);
  }

  if (!message) {
    throw new Error("Message not found");
  }

  if (message.userId.toString() !== userId.toString()) {
    const chat = await chatModel.findById(message.chatId);
    if (!chat || chat.userId.toString() !== userId.toString()) {
      throw new Error("Access denied. This message does not belong to you");
    }
  }

  return message;
};
