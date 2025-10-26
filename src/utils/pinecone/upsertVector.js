import mongoose from "mongoose";
import pineconeClient from "../../config/pineconeClient.js";

export async function upsertVector(indexName, vector, mongoId) {
  if (!indexName || typeof indexName !== "string") {
    throw new Error("A valid indexName is required.");
  }
  if (!vector?.values || !Array.isArray(vector.values)) {
    throw new Error("A valid vector is required.");
  }
  if (!mongoId || !mongoose.Types.ObjectId.isValid(mongoId)) {
    throw new Error("mongoId must be a string");
  }

  try {
    const index = pineconeClient.index(indexName);

    await index.upsert([
      {
        id: mongoId,
        values: vector.values,
        metadata: vector.metadata || {},
      },
    ]);

    return mongoId;
  } catch (error) {
    console.error(`Error upserting vector ${mongoId} to index ${indexName}:`, error);
    throw error;
  }
}
