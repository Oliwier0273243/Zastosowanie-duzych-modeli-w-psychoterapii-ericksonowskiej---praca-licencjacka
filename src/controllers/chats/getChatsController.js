import { getChatsService } from "../../services/chats/getChatsService.js";

export const getChatsController = async (req, res) => {
  try {
    const { page = 1, limit = 20, sortBy = "createdAt", order = "asc" } = req.query;

    const sortOrder = order === "desc" ? -1 : 1;
    const sort = { [sortBy]: sortOrder };

    const chats = await getChatsService(req.userId, parseInt(page), parseInt(limit), sort);

    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
