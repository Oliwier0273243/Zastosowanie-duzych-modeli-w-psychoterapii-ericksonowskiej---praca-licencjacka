import chatModel from "../../models/chatModel.js";

export const getChatsService = async (userId, page, limit, sort) => {
  const query = { userId };

  const offset = (page - 1) * limit;

  const chats = await chatModel.find(query).sort(sort).skip(offset).limit(limit);

  const allChatsCount = await chatModel.countDocuments(query);

  return {
    chats,
    allChatsCount,
    page,
    pages: Math.ceil(allChatsCount / limit),
  };
};
