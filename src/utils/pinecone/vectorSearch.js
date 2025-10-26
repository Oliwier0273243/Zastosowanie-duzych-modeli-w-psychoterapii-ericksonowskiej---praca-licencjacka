import pineconeClient from "../../config/pineconeClient.js";

export async function vectorSearch(indexName, queryVector, options = {}) {
  if (!indexName || typeof indexName !== "string") {
    throw new Error("A valid indexName is required.");
  }
  if (!Array.isArray(queryVector)) {
    throw new Error("A valid vector must be provided.");
  }

  const {
    userId,
    role,
    additionalFilters = {},
    topK = 5,
    includeMetadata = true,
    includeValues = false,
  } = options;

  if (userId && typeof userId !== "string") {
    throw new Error("userId must be a string");
  }
  if (role && typeof role !== "string") {
    throw new Error("role must be a string");
  }
  if (additionalFilters && typeof additionalFilters !== "object") {
    throw new Error("additionalFilters must be an object");
  }
  if (topK && typeof topK !== "number") {
    throw new Error("topK must be a number");
  }
  if (includeMetadata && typeof includeMetadata !== "boolean") {
    throw new Error("includeMetadata must be a boolean");
  }
  if (includeValues && typeof includeValues !== "boolean") {
    throw new Error("includeValues must be a boolean");
  }

  const filter = {
    ...(userId && { userId }),
    ...(role && { role }),
    ...additionalFilters,
  };

  try {
    const index = pineconeClient.index(indexName);

    const result = await index.query({
      vector: queryVector,
      topK,
      filter: Object.keys(filter).length ? filter : undefined,
      includeMetadata,
      includeValues,
    });

    return result.matches || [];
  } catch (error) {
    console.error(`Error searching vectors in index ${indexName}:`, error);
    throw error;
  }
}
