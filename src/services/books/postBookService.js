import { bookModel } from "../../models/bookSchema.js";
import { upsertVector } from "../../utils/pinecone/upsertVector.js";
import { getEmbedding } from "../../utils/embedding.js";

export const postBookService = async (bookData, userRole) => {
  if (!userRole || userRole !== "admin") throw new Error("Book only can be issued by admin");

  const newBook = await bookModel.create({
    title: bookData.title,
    author: bookData.author || "",
    description: bookData.description || "",
    coverUrl: bookData.coverUrl || "",
    totalPages: bookData.totalPages || 0,
    language: bookData.language || "pl",
  });

  const savedBook = await newBook.save();

  const embeddingContent = `
        Book: ${savedBook.title || ""}
        Author: ${savedBook.author || ""}
        Description: ${savedBook.description || ""}
        Total Pages: ${savedBook.totalPages || 0}
    `.trim();

  let attempts = 0;
  let success = false;
  let lastError = null;

  while (attempts < 3 && !success) {
    try {
      attempts++;
      const vector = await getEmbedding(embeddingContent);

      const pineconeVector = {
        values: vector,
        metadata: {
          bookId: savedBook._id.toString(),
          role: "admin",
        },
      };

      await upsertVector("books", pineconeVector, savedBook._id.toString());

      success = true;
    } catch (pineconeError) {
      lastError = pineconeError;
      console.error(`Failed to add book to Pinecone (attempt ${attempts}):`, pineconeError.message);
      if (attempts < 3) {
        console.log("Retrying...");
      }
    }
  }

  if (!success) {
    console.error("Giving up after 3 failed attempts to add book to Pinecone.");
    throw lastError;
  }

  return savedBook;
};
