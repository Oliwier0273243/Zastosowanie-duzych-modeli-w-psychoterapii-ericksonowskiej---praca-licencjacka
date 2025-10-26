import { deleteNoteService } from "../../services/notes/deleteNoteService.js";

export const deleteNoteController = async (req, res) => {
  try {
    await deleteNoteService(req.params.noteId, req.userId);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
