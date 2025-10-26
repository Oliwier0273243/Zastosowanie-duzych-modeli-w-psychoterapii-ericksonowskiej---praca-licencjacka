import messageModel from "../../../models/messageModel.js";
import { upsertVector } from "../../../utils/pinecone/upsertVector.js";
import { getEmbedding } from "../../../utils/embedding.js";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

export const putMessageService = async (userId, identifier, newData) => {
  let message;

  if (typeof identifier === "string" || identifier instanceof ObjectId) {
    message = await messageModel.findById(identifier);
  } else if (
    identifier &&
    typeof identifier === "object" &&
    identifier.chatId &&
    identifier.messageIndex !== undefined
  ) {
    message = await messageModel.findOne({
      chatId: identifier.chatId,
      messageIndex: identifier.messageIndex,
    });
  } else {
    throw new Error(
      "Invalid message identifier. Provide either messageId or { chatId, messageIndex }"
    );
  }

  if (!message) throw new Error("Message not found.");
  if (message.userId.toString() !== userId.toString()) throw new Error("Access denied.");

  await messageModel.replaceOne({ _id: message._id }, { ...newData, userId });
  const updatedMessage = await messageModel.findById(message._id);

  const m = updatedMessage;
  const embeddingContent = `
        Message: ${m.payload?.title || ""}
        Content: ${m.payload?.text || ""}
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

  if (!success) console.error("Failed to update message in Pinecone after 3 attempts:", lastError);

  return updatedMessage;
};
