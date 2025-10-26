import { postBookService } from "../../services/books/postBookService.js";

export const postBookController = async (req, res) => {
  try {
    const userRole = req.userRole;
    const bookData = req.body;
    const newBook = await postBookService(bookData, userRole);
    res.status(201).json(newBook);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};
