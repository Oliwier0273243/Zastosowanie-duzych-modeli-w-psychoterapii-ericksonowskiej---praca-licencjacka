import { getMessagesService } from "../../../services/chats/messages/getMessagesService.js";

export const getMessagesController = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50, sortBy = "messageIndex", order = "asc", search = "" } = req.query;

    const sortOrder = order === "desc" ? -1 : 1;
    const sort = { [sortBy]: sortOrder };

    const result = await getMessagesService(
      req.userId,
      chatId,
      search,
      parseInt(page),
      parseInt(limit),
      sort
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
