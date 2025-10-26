import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getNotesController } from "../controllers/notes/getNotesController.js";
import { getNoteController } from "../controllers/notes/getNoteController.js";
import { postNoteController } from "../controllers/notes/postNoteController.js";
import { patchNoteController } from "../controllers/notes/patchNoteController.js";
import { putNoteController } from "../controllers/notes/putNoteController.js";
import { deleteNoteController } from "../controllers/notes/deleteNoteController.js";
import { validateNoteMiddleware } from "../middlewares/notes/validateNoteMiddleware.js";
import { validateNotePatchMiddleware } from "../middlewares/notes/validateNotePatchMiddleware.js";

const notesRouter = express.Router();

notesRouter.get("/notes", authMiddleware, getNotesController);
notesRouter.get("/notes/:noteId", authMiddleware, getNoteController);
notesRouter.post("/notes", authMiddleware, validateNoteMiddleware, postNoteController);
notesRouter.patch(
  "/notes/:noteId",
  authMiddleware,
  validateNotePatchMiddleware,
  patchNoteController
);
notesRouter.put("/notes/:noteId", authMiddleware, validateNoteMiddleware, putNoteController);
notesRouter.delete("/notes/:noteId", authMiddleware, deleteNoteController);

export default notesRouter;
