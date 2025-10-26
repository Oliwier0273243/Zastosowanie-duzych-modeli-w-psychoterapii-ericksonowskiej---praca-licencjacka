import { bookPageModel } from "../../../models/bookSchema.js";
import { upsertVector } from "../../../utils/pinecone/upsertVector.js";
import { getEmbedding } from "../../../utils/embedding.js";

export const postBookPageService = async (bookId, pageData, userRole) => {
  if (!userRole || userRole !== "admin") {
    throw new Error("Book page can only be created by admin");
  }

  const lastPage = await bookPageModel.findOne({ bookId }).sort({ pageNumber: -1 });
  const nextPageNumber = lastPage ? lastPage.pageNumber + 1 : 1;

  const newPage = await bookPageModel.create({
    bookId,
    pageNumber: nextPageNumber,
    content: pageData.content,
  });

  const embeddingContent = `
    Book Page: ${newPage.pageNumber}
    Content: ${newPage.content || ""}
    Book ID: ${newPage.bookId || ""}
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
          pageId: newPage._id.toString(),
          bookId: newPage.bookId.toString(),
        },
      };

      await upsertVector("book-pages", pineconeVector, newPage._id.toString());

      success = true;
    } catch (pineconeError) {
      lastError = pineconeError;
      console.error(
        `Failed to add book page to Pinecone (attempt ${attempts}):`,
        pineconeError.message
      );
      if (attempts < 3) {
        console.log("Retrying...");
      }
    }
  }

  if (!success) {
    console.error("Giving up after 3 failed attempts to add book page to Pinecone.");
    throw lastError;
  }

  return newPage;
};
