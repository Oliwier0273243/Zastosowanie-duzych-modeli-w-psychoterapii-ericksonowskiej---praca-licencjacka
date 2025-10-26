import noteModel from "../../models/notesModel.js";
import { deleteVectorByMongoId } from "../../utils/pinecone/deleteVector.js";

export const deleteNoteService = async (noteId, userId) => {
  const note = await noteModel.findById(noteId);
  if (!note) throw new Error("Note not found.");
  if (note.userId.toString() !== userId.toString()) throw new Error("Access denied.");

  await note.deleteOne();

  let success = false;
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await deleteVectorByMongoId("notes", noteId.toString(), userId, null);
      success = true;
      break;
    } catch (err) {
      lastError = err;
    }
  }

  if (!success) console.error("Failed to delete note from Pinecone after 3 attempts:", lastError);

  return { success: true, deletedId: noteId };
};
