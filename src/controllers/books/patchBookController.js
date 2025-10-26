import { patchBookService } from "../../services/books/patchBookService.js";

export const patchBookController = async (req, res) => {
  try {
    const { bookId } = req.params;
    const updates = req.body;
    const userRole = req.userRole;

    const updatedBook = await patchBookService(bookId, updates, userRole);

    res.status(200).json(updatedBook);
  } catch (err) {
    res.status(err.message === "Book not found" ? 404 : 403).json({ message: err.message });
  }
};
