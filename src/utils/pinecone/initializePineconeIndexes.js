import { createVectorIndex } from "./createVectorIndex.js";

export async function initializePineconeIndexes() {
  const indexes = [
    { name: "notes", dimension: 1536, metric: "cosine" },
    { name: "patients", dimension: 1536, metric: "cosine" },
    { name: "messages", dimension: 1536, metric: "cosine" },
    { name: "books", dimension: 1536, metric: "cosine" },
    { name: "book-pages", dimension: 1536, metric: "cosine" },
  ];

  for (const indexConfig of indexes) {
    try {
      await createVectorIndex(indexConfig.name, indexConfig.dimension, indexConfig.metric);
      console.log(`Index '${indexConfig.name}' ready`);
    } catch (error) {
      console.error(`Failed to create index '${indexConfig.name}':`, error);
    }
  }

  console.log("Pinecone indexes initialization completed");
}

export function getIndexNameForService(serviceType) {
  const indexMap = {
    notes: "notes",
    patients: "patients",
    messages: "messages",
    books: "books",
    bookPages: "book-pages",
  };

  return indexMap[serviceType] || serviceType;
}
