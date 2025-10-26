import messageModel from "../../../models/messageModel.js";
import chatModel from "../../../models/chatModel.js";
import { upsertVector } from "../../../utils/pinecone/upsertVector.js";
import { getEmbedding } from "../../../utils/embedding.js";
import { generateChatTitle } from "../../../utils/generateChatTitle.js";

export const postMessageService = async (messageData, userId) => {
  const chat = await chatModel.findById(messageData.chatId);
  if (!chat) throw new Error("Chat not found");
  if (chat.userId.toString() !== userId.toString()) throw new Error("Access denied.");

  const newMessage = new messageModel({ ...messageData, userId });
  const savedMessage = await newMessage.save();

  if (chat.title === "" && savedMessage.payload?.text) {
    const autoTitle = generateChatTitle(savedMessage.payload.text);
    if (autoTitle) {
      await chatModel.findByIdAndUpdate(chat._id, { title: autoTitle });
    }
  }

  const embeddingContent = `
        Message: ${savedMessage.payload?.title || ""}
        Content: ${savedMessage.payload?.text || ""}
    `.trim();

  let attempts = 0;
  let success = false;
  let lastError = null;

  while (attempts < 3 && !success) {
    try {
      attempts++;
      const vector = await getEmbedding(embeddingContent);

      const pineconeVector = {
        values: vector,
        metadata: {
          messageId: savedMessage._id.toString(),
          userId: savedMessage.userId.toString(),
        },
      };

      await upsertVector("messages", pineconeVector, savedMessage._id.toString());

      success = true;
    } catch (pineconeError) {
      lastError = pineconeError;
      console.error(
        `Failed to add message to Pinecone (attempt ${attempts}):`,
        pineconeError.message
      );
      if (attempts < 3) {
        console.log("Retrying...");
      }
    }
  }

  if (!success) {
    console.error("Giving up after 3 failed attempts to add message to Pinecone.");
    throw lastError;
  }

  return savedMessage;
};
