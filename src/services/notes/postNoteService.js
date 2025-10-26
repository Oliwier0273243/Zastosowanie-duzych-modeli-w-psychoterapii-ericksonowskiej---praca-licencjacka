import noteModel from "../../models/notesModel.js";
import { upsertVector } from "../../utils/pinecone/upsertVector.js";
import { getEmbedding } from "../../utils/embedding.js";

export const postNoteService = async (noteData, userId) => {
  const newNote = new noteModel({ ...noteData, userId });
  const savedNote = await newNote.save();

  const embeddingContent = `
        Note: ${savedNote.title || ""}
        Content: ${savedNote.text || ""}
    `.trim();

  let attempts = 0;
  let success = false;
  let lastError = null;

  while (attempts < 3 && !success) {
    try {
      attempts++;
      const vector = await getEmbedding(embeddingContent);

      const pineconeVector = {
        values: vector,
        metadata: {
          noteId: savedNote._id.toString(),
          userId: savedNote.userId.toString(),
        },
      };

      await upsertVector("notes", pineconeVector, savedNote._id.toString());

      success = true;
    } catch (pineconeError) {
      lastError = pineconeError;
      console.error(`Failed to add note to Pinecone (attempt ${attempts}):`, pineconeError.message);
      if (attempts < 3) {
        console.log("Retrying...");
      }
    }
  }

  if (!success) {
    console.error("Giving up after 3 failed attempts to add note to Pinecone.");
    throw lastError;
  }

  return savedNote;
};
