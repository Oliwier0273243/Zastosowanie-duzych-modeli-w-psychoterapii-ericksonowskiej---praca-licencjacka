import { deleteMessageService } from "../../../services/chats/messages/deleteMessageService.js";

export const deleteMessageController = async (req, res) => {
  try {
    const { messageNumber, chatId } = req.params;
    const userId = req.userId;

    const messageIdentifier = { chatId, messageIndex: parseInt(messageNumber) };
    const result = await deleteMessageService(userId, messageIdentifier);

    res.status(200).json({
      message: "Message deleted successfully",
      deletedId: result.deletedId,
      success: result.success,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
