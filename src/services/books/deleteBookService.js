import { bookModel } from "../../models/bookSchema.js";
import { deleteVectorByMongoId } from "../../utils/pinecone/deleteVector.js";

export const deleteBookService = async (bookId, userRole) => {
  const book = await bookModel.findById(bookId);
  if (!book) throw new Error("Book not found.");
  if (!userRole || userRole !== "admin")
    throw new Error("You have to be admin in order to delete books");

  await book.deleteOne();

  let success = false;
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await deleteVectorByMongoId("books", bookId.toString(), null, userRole);
      success = true;
      break;
    } catch (err) {
      lastError = err;
    }
  }

  if (!success) console.error("Failed to delete book from Pinecone after 3 attempts:", lastError);

  return { success: true, deletedId: bookId };
};
