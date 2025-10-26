import { getBookService } from "../../services/books/getBookService.js";

export const getBookController = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await getBookService(bookId);
    res.status(200).json(book);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
