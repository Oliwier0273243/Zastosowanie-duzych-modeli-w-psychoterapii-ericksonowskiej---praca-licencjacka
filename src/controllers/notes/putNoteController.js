import { putNoteService } from "../../services/notes/putNoteService.js";

export const putNoteController = async (req, res) => {
  try {
    const replacedNote = await putNoteService(req.params.noteId, req.body, req.userId);
    res.json(replacedNote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
