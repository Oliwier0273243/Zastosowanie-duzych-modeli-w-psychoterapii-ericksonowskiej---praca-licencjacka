import { patchChatService } from "../../services/chats/patchChatService.js";

export const patchChatController = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.userId;
    const updates = req.body;

    const updatedChat = await patchChatService(chatId, updates, userId);

    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
