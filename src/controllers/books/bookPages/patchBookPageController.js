import { patchBookPageService } from "../../../services/books/bookPages/patchBookPageService.js";

export const patchBookPageController = async (req, res) => {
  try {
    const { bookId, pageNumber } = req.params;
    const updatedPage = await patchBookPageService(
      bookId,
      parseInt(pageNumber),
      req.body,
      req.userRole
    );
    res.json(updatedPage);
  } catch (err) {
    res.status(err.message === "Book page not found" ? 404 : 403).json({
      message: err.message,
    });
  }
};
