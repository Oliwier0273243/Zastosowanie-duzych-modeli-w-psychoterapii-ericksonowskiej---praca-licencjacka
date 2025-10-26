import pineconeClient from "../../config/pineconeClient.js";
import mongoose from "mongoose";

export async function deleteVectorByMongoId(indexName, mongoId, currentUserId, currentUserRole) {
  if (!indexName || typeof indexName !== "string") {
    throw new Error("A valid indexName is required.");
  }
  if (!mongoId || !mongoose.Types.ObjectId.isValid(mongoId)) {
    throw new Error("A valid mongoId is required and must be a valid ObjectId string.");
  }

  try {
    const index = pineconeClient.index(indexName);

    const vectorId = mongoId instanceof Object ? mongoId.toHexString() : String(mongoId);
    const response = await index.fetch([vectorId]);
    const vector = response.records?.[vectorId];

    if (!vector) {
      console.warn(`Vector ${mongoId} not found in index ${indexName}, skipping delete.`);
      return;
    }

    const metadata = vector.metadata || {};
    if (metadata.userId && currentUserId && metadata.userId !== currentUserId) {
      throw new Error("Unauthorized: userId does not match.");
    }
    if (metadata.role && currentUserRole && metadata.role !== currentUserRole) {
      throw new Error("Unauthorized: role does not match.");
    }

    await index.deleteOne(vectorId);

    console.log(`Vector ${mongoId} deleted successfully from index ${indexName}`);
  } catch (error) {
    console.error(`Error deleting vector ${mongoId} from index ${indexName}:`, error);
    throw error;
  }
}
