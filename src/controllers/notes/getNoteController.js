import { getNoteService } from "../../services/notes/getNoteService.js";

export const getNoteController = async (req, res) => {
  try {
    const note = await getNoteService(req.params.noteId, req.userId);
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
