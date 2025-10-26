import { bookModel } from "../../models/bookSchema.js";

export const getBookService = async (bookId) => {
  const book = await bookModel.findById(bookId);

  if (!book) {
    throw new Error("Book not found");
  }

  return book;
};
