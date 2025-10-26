import noteModel from "../../models/notesModel.js";
import { upsertVector } from "../../utils/pinecone/upsertVector.js";
import { getEmbedding } from "../../utils/embedding.js";

export const putNoteService = async (noteId, newData, userId) => {
  const note = await noteModel.findById(noteId);
  if (!note) throw new Error("Note not found.");
  if (note.userId.toString() !== userId.toString()) throw new Error("Access denied.");

  const updatedNote = await noteModel.findByIdAndUpdate(
    noteId,
    { ...newData, userId },
    { new: true, runValidators: true, overwrite: true }
  );

  if (!updatedNote) throw new Error("Failed to update note.");

  const embeddingContent = `
        Note: ${updatedNote.title || ""}
        Content: ${updatedNote.text || ""}
    `.trim();

  let success = false;
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const vector = await getEmbedding(embeddingContent);
      await upsertVector(
        "notes",
        {
          values: vector,
          metadata: {
            noteId: updatedNote._id.toString(),
            userId: updatedNote.userId.toString(),
          },
        },
        updatedNote._id.toString()
      );
      success = true;
      break;
    } catch (err) {
      lastError = err;
      console.error(`Failed to update note in Pinecone (attempt ${attempt}):`, err.message);
    }
  }

  if (!success) {
    console.error("Giving up after 3 failed attempts to update note in Pinecone:", lastError);
  }

  return updatedNote;
};
