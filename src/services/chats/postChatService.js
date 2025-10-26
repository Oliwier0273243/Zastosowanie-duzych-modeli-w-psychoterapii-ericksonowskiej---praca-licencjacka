import chatModel from "../../models/chatModel.js";

export const postChatService = async (userId, chatData) => {
  const chat = new chatModel({
    ...chatData,
    userId,
    title: "",
  });
  return await chat.save();
};
