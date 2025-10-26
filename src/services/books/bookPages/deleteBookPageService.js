import { bookPageModel } from "../../../models/bookSchema.js";
import { deleteVectorByMongoId } from "../../../utils/pinecone/deleteVector.js";

export const deleteBookPageService = async (bookId, pageNumber, userRole) => {
  if (!userRole || userRole !== "admin") {
    throw new Error("Book page can only be deleted by admin");
  }

  const page = await bookPageModel.findOne({ bookId, pageNumber });
  if (!page) {
    throw new Error("Book page not found");
  }

  const pageId = page._id.toString();

  const result = await bookPageModel.deleteOne({ bookId, pageNumber });

  if (result.deletedCount === 0) {
    throw new Error("Book page not found or already deleted");
  }

  let success = false;
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await deleteVectorByMongoId("book-pages", pageId, null, userRole);
      success = true;
      break;
    } catch (err) {
      lastError = err;
    }
  }

  if (!success)
    console.error("Failed to delete book page from Pinecone after 3 attempts:", lastError);

  return { success: true, deletedId: pageId };
};
