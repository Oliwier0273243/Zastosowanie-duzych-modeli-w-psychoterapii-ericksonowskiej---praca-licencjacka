import { postBookPageService } from "../../../services/books/bookPages/postBookPageService.js";

export const postBookPageController = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userRole = req.userRole;
    const newPage = await postBookPageService(bookId, req.body, userRole);
    res.status(201).json(newPage);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};
