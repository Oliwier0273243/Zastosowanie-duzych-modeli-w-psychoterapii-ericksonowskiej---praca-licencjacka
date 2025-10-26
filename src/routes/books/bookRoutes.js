import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { validateBookMiddleware } from "../../middlewares/books/validateBookMiddleware.js";
import { getBooksController } from "../../controllers/books/getBooksController.js";
import { getBookController } from "../../controllers/books/getBookController.js";
import { postBookController } from "../../controllers/books/postBookController.js";
import { putBookController } from "../../controllers/books/putBookController.js";
import { patchBookController } from "../../controllers/books/patchBookController.js";
import { deleteBookController } from "../../controllers/books/deleteBookController.js";
import { validateBookPatchMiddleware } from "../../middlewares/books/validateBookPatchMiddleware.js";

const booksRouter = express.Router();

booksRouter.get("/books", authMiddleware, getBooksController);
booksRouter.get("/books/:bookId", authMiddleware, getBookController);

// only for admin
booksRouter.post("/books", authMiddleware, validateBookMiddleware, postBookController);
booksRouter.put("/books/:bookId", authMiddleware, validateBookMiddleware, putBookController);
booksRouter.patch(
  "/books/:bookId",
  authMiddleware,
  validateBookPatchMiddleware,
  patchBookController
);
booksRouter.delete("/books/:bookId", authMiddleware, deleteBookController);

export default booksRouter;
