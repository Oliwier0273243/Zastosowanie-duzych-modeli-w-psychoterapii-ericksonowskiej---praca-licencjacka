import { getNotesService } from "../../services/notes/getNotesService.js";

export const getNotesController = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", sortBy = "createdAt", order = "asc" } = req.query;

    const sortOrder = order === "desc" ? -1 : 1;
    const sort = { [sortBy]: sortOrder };

    const notes = await getNotesService(req.userId, search, parseInt(page), parseInt(limit), sort);

    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
