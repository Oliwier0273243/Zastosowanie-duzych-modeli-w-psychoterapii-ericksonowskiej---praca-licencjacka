import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getEmbedding(content) {
  if (!content || typeof content !== "string") {
    throw new Error("Content must be a non-empty string.");
  }

  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: content,
    });

    const embedding = response.data[0].embedding;
    return embedding;
  } catch (error) {
    console.error("OpenAI embedding error:", error);
    throw error;
  }
}
