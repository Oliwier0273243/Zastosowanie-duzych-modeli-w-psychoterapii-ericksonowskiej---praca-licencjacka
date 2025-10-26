import noteModel from "../../models/notesModel.js";

export const getNoteService = async (noteId, userId) => {
  const note = await noteModel.findById(noteId);

  if (!note) {
    throw new Error("Note not found");
  }

  if (note.userId.toString() !== userId.toString()) {
    throw new Error("Access denied. This note does not belong to you");
  }

  return note;
};
