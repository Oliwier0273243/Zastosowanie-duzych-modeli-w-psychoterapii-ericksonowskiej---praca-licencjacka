import { deleteBookService } from "../../services/books/deleteBookService.js";

export const deleteBookController = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userRole = req.userRole;
    await deleteBookService(bookId, userRole);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(err.message === "Book not found" ? 404 : 403).json({ message: err.message });
  }
};
