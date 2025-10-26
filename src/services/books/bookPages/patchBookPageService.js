import { bookPageModel } from "../../../models/bookSchema.js";
import { upsertVector } from "../../../utils/pinecone/upsertVector.js";
import { getEmbedding } from "../../../utils/embedding.js";

export const patchBookPageService = async (bookId, pageNumber, patchData, userRole) => {
  if (!userRole || userRole !== "admin") {
    throw new Error("Book page can only be patched by admin");
  }

  const page = await bookPageModel.findOne({ bookId, pageNumber });
  if (!page) throw new Error("Book page not found");

  Object.assign(page, patchData);
  const savedPage = await page.save();

  const p = savedPage;
  const embeddingContent = `
    Book Page: ${p.pageNumber || ""}
    Content: ${p.content || ""}
    Book ID: ${p.bookId || ""}
  `.trim();

  let success = false;
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const vector = await getEmbedding(embeddingContent);
      await upsertVector(
        "book-pages",
        {
          values: vector,
          metadata: {
            pageId: p._id.toString(),
            bookId: p.bookId.toString(),
          },
        },
        p._id.toString()
      );
      success = true;
      break;
    } catch (err) {
      lastError = err;
    }
  }

  if (!success)
    console.error("Failed to upsert book page in Pinecone after 3 attempts:", lastError);

  return savedPage;
};
