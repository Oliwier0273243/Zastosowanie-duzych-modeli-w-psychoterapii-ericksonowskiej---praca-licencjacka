import pineconeClient from "../../config/pineconeClient.js";

export async function createVectorIndex(indexName, dimension = 1536, metric = "cosine") {
  if (!indexName || typeof indexName !== "string") {
    throw new Error("A valid indexName is required.");
  }

  try {
    const indexesList = await pineconeClient.listIndexes();
    const existingIndex = indexesList.indexes?.find((index) => index.name === indexName);

    if (!existingIndex) {
      await pineconeClient.createIndex({
        name: indexName,
        dimension,
        metric,
        spec: {
          serverless: {
            cloud: "aws",
            region: "us-east-1",
          },
        },
      });

      console.log(
        `Created Pinecone index "${indexName}" with dimension=${dimension}, metric=${metric}`
      );
    } else {
      console.log(`Index "${indexName}" already exists.`);
    }
  } catch (error) {
    console.error(`Error managing Pinecone index "${indexName}":`, error);
    throw error;
  }
}
