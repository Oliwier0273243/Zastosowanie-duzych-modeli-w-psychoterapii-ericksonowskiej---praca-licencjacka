import noteModel from "../../models/notesModel.js";
import { upsertVector } from "../../utils/pinecone/upsertVector.js";
import { getEmbedding } from "../../utils/embedding.js";

export const patchNoteService = async (noteId, updates, userId) => {
  const note = await noteModel.findById(noteId);
  if (!note) throw new Error("Note not found.");
  if (note.userId.toString() !== userId.toString()) throw new Error("Access denied.");

  Object.assign(note, updates);
  const savedNote = await note.save();

  const n = savedNote;
  const embeddingContent = `
        Note: ${savedNote.title || ""}
        Content: ${savedNote.text || ""}
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
            noteId: n._id.toString(),
            userId: n.userId.toString(),
          },
        },
        n._id.toString()
      );
      success = true;
      break;
    } catch (err) {
      lastError = err;
    }
  }

  if (!success) console.error("Failed to upsert note in Pinecone after 3 attempts:", lastError);

  return savedNote;
};
