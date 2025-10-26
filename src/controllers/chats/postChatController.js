import { postChatService } from "../../services/chats/postChatService.js";

export const postChatController = async (req, res) => {
  try {
    const userId = req.userId;
    const chatData = req.body;

    const newChat = await postChatService(userId, chatData);

    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
