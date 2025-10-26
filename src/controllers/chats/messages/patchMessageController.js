import { patchMessageService } from "../../../services/chats/messages/patchMessageService.js";

export const patchMessageController = async (req, res) => {
  try {
    const { messageNumber, chatId } = req.params;
    const userId = req.userId;

    const updated = await patchMessageService(
      userId,
      { chatId, messageIndex: parseInt(messageNumber) },
      req.body
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
