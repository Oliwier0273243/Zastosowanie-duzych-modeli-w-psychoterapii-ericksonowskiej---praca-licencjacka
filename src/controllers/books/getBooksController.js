import { getBooksService } from "../../services/books/getBooksService.js";

export const getBooksController = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", sortBy = "createdAt", order = "asc" } = req.query;

    const sortOrder = order === "desc" ? -1 : 1;
    const sort = { [sortBy]: sortOrder };

    const data = await getBooksService(search, parseInt(page), parseInt(limit), sort);

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
