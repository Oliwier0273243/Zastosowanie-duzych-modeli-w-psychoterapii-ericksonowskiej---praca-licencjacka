import { putChatService } from "../../services/chats/putChatService.js";

export const putChatController = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.userId;
    const newData = req.body;

    const updatedChat = await putChatService(chatId, newData, userId);

    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
