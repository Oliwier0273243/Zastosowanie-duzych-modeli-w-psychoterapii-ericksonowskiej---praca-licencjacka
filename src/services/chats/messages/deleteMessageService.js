import messageModel from "../../../models/messageModel.js";
import chatModel from "../../../models/chatModel.js";
import { deleteVectorByMongoId } from "../../../utils/pinecone/deleteVector.js";

export const deleteMessageService = async (userId, identifier) => {
  let message;
  if (identifier && typeof identifier === "object") {
    const { chatId, messageIndex } = identifier;
    message = await messageModel.findOne({ chatId, messageIndex });
  } else {
    message = await messageModel.findById(identifier);
  }

  if (!message) throw new Error("Message not found");

  if (message.userId.toString() !== userId.toString()) {
    const chat = await chatModel.findById(message.chatId);
    if (!chat || chat.userId.toString() !== userId.toString()) {
      throw new Error("Access denied.");
    }
  }

  const mongoId = message._id.toString();
  await message.deleteOne();

  let success = false;
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await deleteVectorByMongoId("messages", mongoId, userId, null);
      success = true;
      break;
    } catch (err) {
      lastError = err;
    }
  }

  if (!success)
    console.error("Failed to delete message from Pinecone after 3 attempts:", lastError);

  return { success: true, deletedId: mongoId };
};
