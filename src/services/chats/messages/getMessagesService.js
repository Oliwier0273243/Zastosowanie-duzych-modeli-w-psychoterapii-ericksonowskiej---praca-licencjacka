import chatModel from "../../../models/chatModel.js";
import messageModel from "../../../models/messageModel.js";

export const getMessagesService = async (
  userId,
  chatId,
  search = "",
  page = 1,
  limit = 20,
  sort = { createdAt: -1 }
) => {
  if (!chatId) {
    throw new Error("chatId is required");
  }

  const chat = await chatModel.findById(chatId);
  if (!chat) {
    throw new Error("Chat not found");
  }
  if (chat.userId.toString() !== userId.toString()) {
    throw new Error("Access denied. You do not have access to this chat.");
  }

  const query = { userId };
  if (chatId) {
    query.chatId = chatId;
  }

  const hasSearch = search && search.trim() !== "";
  if (hasSearch) {
    query.$text = { $search: search };
  }

  const offset = (page - 1) * limit;

  const sortOption = hasSearch ? { score: { $meta: "textScore" }, ...sort } : sort;

  const messages = await messageModel.find(query).sort(sortOption).skip(offset).limit(limit);

  const allMessagesCount = await messageModel.countDocuments(query);

  return {
    messages,
    allMessagesCount,
    page,
    pages: Math.ceil(allMessagesCount / limit),
  };
};
