import { putMessageService } from "../../../services/chats/messages/putMessageService.js";

export const putMessageController = async (req, res) => {
  try {
    const { messageNumber, chatId } = req.params;
    const userId = req.userId;

    const updated = await putMessageService(
      userId,
      { chatId, messageIndex: parseInt(messageNumber) },
      req.body
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
