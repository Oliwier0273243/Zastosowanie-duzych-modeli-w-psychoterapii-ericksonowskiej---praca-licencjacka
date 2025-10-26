import { putBookService } from "../../services/books/putBookService.js";

export const putBookController = async (req, res) => {
  try {
    const { bookId } = req.params;
    const newData = req.body;
    const userRole = req.userRole;
    const updatedBook = await putBookService(bookId, newData, userRole);
    res.status(200).json(updatedBook);
  } catch (err) {
    res.status(err.message === "Book not found" ? 404 : 403).json({ message: err.message });
  }
};
