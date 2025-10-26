import { getBookPageService } from "../../../services/books/bookPages/getBookPageService.js";

export const getBookPageController = async (req, res) => {
  try {
    const { bookId, pageNumber } = req.params;
    const { language } = req.query;

    const page = await getBookPageService(bookId, parseInt(pageNumber), language);
    res.json(page);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
