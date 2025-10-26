import { deleteChatService } from "../../services/chats/deleteChatService.js";

export const deleteChatController = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.userId;

    await deleteChatService(chatId, userId);

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
