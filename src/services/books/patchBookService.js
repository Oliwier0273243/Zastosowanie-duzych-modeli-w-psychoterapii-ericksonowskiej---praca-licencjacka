import { bookModel } from "../../models/bookSchema.js";
import { upsertVector } from "../../utils/pinecone/upsertVector.js";
import { getEmbedding } from "../../utils/embedding.js";

export const patchBookService = async (bookId, updates, userRole) => {
  const book = await bookModel.findById(bookId);
  if (!book) throw new Error("Book not found.");
  if (!userRole || userRole !== "admin") throw new Error("Book can only be updated by admin");

  Object.assign(book, updates);
  const savedBook = await book.save();

  const b = savedBook;
  const embeddingContent = `
        Book: ${b.title || ""}
        Author: ${b.author || ""}
        Language: ${b.language || ""}
        Description: ${b.description || ""}
        Total Pages: ${b.totalPages || 0}
    `.trim();

  let success = false;
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const vector = await getEmbedding(embeddingContent);
      await upsertVector(
        "books",
        {
          values: vector,
          metadata: {
            bookId: b._id.toString(),
            role: "admin",
          },
        },
        b._id.toString()
      );
      success = true;
      break;
    } catch (err) {
      lastError = err;
    }
  }

  if (!success) console.error("Failed to upsert book in Pinecone after 3 attempts:", lastError);

  return savedBook;
};
