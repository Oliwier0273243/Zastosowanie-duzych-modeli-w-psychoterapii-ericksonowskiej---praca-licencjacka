import pineconeClient from "../../config/pineconeClient.js";
import mongoose from "mongoose";

export async function updateVector(indexName, vector, currentUserId, currentUserRole) {
  if (!indexName || typeof indexName !== "string") {
    throw new Error("A valid indexName is required.");
  }
  if (!vector?.values || !Array.isArray(vector.values)) {
    throw new Error("A valid vector is required.");
  }
  if (!vector?.id || !mongoose.Types.ObjectId.isValid(vector.id)) {
    throw new Error("A valid mongodb id is required.");
  }

  try {
    const index = pineconeClient.index(indexName);

    const existing = await index.fetch([vector.id]);
    const existingVector = existing.vectors?.[vector.id];

    if (existingVector) {
      const metadata = existingVector.metadata || {};
      if (metadata.userId && currentUserId && metadata.userId !== currentUserId) {
        throw new Error("Unauthorized: userId does not match.");
      }
      if (metadata.role && currentUserRole && metadata.role !== currentUserRole) {
        throw new Error("Unauthorized: role does not match.");
      }
    }

    await index.upsert([
      {
        id: vector.id,
        values: vector.values,
        metadata: vector.metadata || {},
      },
    ]);
  } catch (error) {
    console.error(`Error updating vector ${vector.id} in index ${indexName}:`, error);
    throw error;
  }
}
