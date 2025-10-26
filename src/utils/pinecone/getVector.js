import pineconeClient from "../../config/pineconeClient.js";

export async function getVector(indexName, vectorId, currentUserId, currentUserRole) {
  if (!indexName || typeof indexName !== "string") {
    throw new Error("A valid indexName is required.");
  }
  if (!vectorId || typeof vectorId !== "string") {
    throw new Error("A valid vectorId is required.");
  }

  try {
    const index = pineconeClient.index(indexName);

    const response = await index.fetch([vectorId]);
    const vector = response.vectors?.[vectorId];

    if (!vector) throw new Error("Vector not found");

    const metadata = vector.metadata || {};
    if (metadata.userId && currentUserId && metadata.userId !== currentUserId) {
      throw new Error("Unauthorized: userId mismatch");
    }
    if (metadata.role && currentUserRole && metadata.role !== currentUserRole) {
      throw new Error("Unauthorized: role mismatch");
    }

    return vector;
  } catch (error) {
    console.error(`Error getting vector ${vectorId} from index ${indexName}:`, error);
    throw error;
  }
}
