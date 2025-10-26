import { bookPageModel } from "../../../models/bookSchema.js";

export const getBookPagesService = async (bookId) => {
  const pages = await bookPageModel.find({ bookId }).sort({ pageNumber: 1 });
  return pages;
};
