import messageModel from "../../../models/messageModel.js";
import chatModel from "../../../models/chatModel.js";
import { upsertVector } from "../../../utils/pinecone/upsertVector.js";
import { getEmbedding } from "../../../utils/embedding.js";

export const patchMessageService = async (userId, identifier, updates) => {
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

  Object.assign(message, updates);
  const savedMessage = await message.save();

  const m = savedMessage;
  const embeddingContent = `
        Message: ${savedMessage.payload?.title || ""}
        Content: ${savedMessage.payload?.text || ""}
    `.trim();

  let success = false;
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const vector = await getEmbedding(embeddingContent);
      await upsertVector(
        "messages",
        {
          values: vector,
          metadata: {
            messageId: m._id.toString(),
            userId: m.userId.toString(),
          },
        },
        m._id.toString()
      );
      success = true;
      break;
    } catch (err) {
      lastError = err;
    }
  }

  if (!success) console.error("Failed to upsert message in Pinecone after 3 attempts:", lastError);

  return savedMessage;
};
