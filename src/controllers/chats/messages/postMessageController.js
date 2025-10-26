import { postMessageService } from "../../../services/chats/messages/postMessageService.js";

export const postMessageController = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.userId;

    const saved = await postMessageService(
      {
        ...req.body,
        chatId,
      },
      userId
    );

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
