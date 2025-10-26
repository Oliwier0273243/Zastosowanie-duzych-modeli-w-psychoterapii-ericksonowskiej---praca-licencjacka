import { postNoteService } from "../../services/notes/postNoteService.js";

export const postNoteController = async (req, res) => {
  try {
    const newNote = await postNoteService(req.body, req.userId);
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
