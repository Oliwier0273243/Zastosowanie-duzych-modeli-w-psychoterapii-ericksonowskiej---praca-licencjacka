import { bookModel, bookPageModel } from "../../../models/bookSchema.js";
import { translateBookPage } from "./translationService.js";

export const getBookPageService = async (bookId, pageNumber, targetLanguage = null) => {
  const page = await bookPageModel.findOne({ bookId, pageNumber });
  if (!page) throw new Error("Book page not found");

  if (!targetLanguage) return page;

  const book = await bookModel.findById(bookId);
  if (!book) throw new Error("Book not found");

  if (book.language === targetLanguage) return page;

  const translatedContent = await translateBookPage({ bookId, pageNumber, targetLanguage });

  return {
    ...page.toObject(),
    content: translatedContent,
    language: targetLanguage,
  };
};
