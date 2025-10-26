import { patchNoteService } from "../../services/notes/patchNoteService.js";

export const patchNoteController = async (req, res) => {
  try {
    const updatedNote = await patchNoteService(req.params.noteId, req.body, req.userId);
    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
