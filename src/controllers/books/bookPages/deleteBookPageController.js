import { deleteBookPageService } from "../../../services/books/bookPages/deleteBookPageService.js";

export const deleteBookPageController = async (req, res) => {
  try {
    const { bookId, pageNumber } = req.params;
    await deleteBookPageService(bookId, parseInt(pageNumber), req.userRole);
    res.json({ message: "Book page deleted successfully" });
  } catch (err) {
    res.status(err.message === "Book page not found or already deleted" ? 404 : 403).json({
      message: err.message,
    });
  }
};
