import { getChatService } from "../../services/chats/getChatService.js";

export const getChatController = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.userId;

    const chat = await getChatService(chatId, userId);

    res.status(200).json(chat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
