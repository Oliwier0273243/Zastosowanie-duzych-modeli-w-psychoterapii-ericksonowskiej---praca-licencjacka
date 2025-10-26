import { getBookPagesService } from "../../../services/books/bookPages/getBookPagesService.js";

export const getBookPagesController = async (req, res) => {
  try {
    const { bookId } = req.params;
    const pages = await getBookPagesService(bookId);
    res.json(pages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching pages" });
  }
};
