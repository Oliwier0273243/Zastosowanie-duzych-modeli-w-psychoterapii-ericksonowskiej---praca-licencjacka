import { getMessageService } from "../../../services/chats/messages/getMessageService.js";

export const getMessageController = async (req, res) => {
  try {
    const { messageNumber, chatId } = req.params;
    const userId = req.userId;

    const message = await getMessageService(userId, {
      chatId,
      messageIndex: parseInt(messageNumber),
    });
    res.json(message);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
