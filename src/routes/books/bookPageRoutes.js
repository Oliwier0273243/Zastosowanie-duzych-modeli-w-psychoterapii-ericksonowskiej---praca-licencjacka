import express from "express";
import { validateBookPageMiddleware } from "../../middlewares/books/validateBookPageMiddleware.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { getBookPagesController } from "../../controllers/books/bookPages/getBookPagesController.js";
import { getBookPageController } from "../../controllers/books/bookPages/getBookPageController.js";
import { postBookPageController } from "../../controllers/books/bookPages/postBookPageController.js";
import { putBookPageController } from "../../controllers/books/bookPages/putBookPageController.js";
import { patchBookPageController } from "../../controllers/books/bookPages/patchBookPageController.js";
import { deleteBookPageController } from "../../controllers/books/bookPages/deleteBookPageController.js";
import { validateBookPagePatchMiddleware } from "../../middlewares/books/validateBookPagePatchMiddleware.js";

const bookPagesRouter = express.Router();

bookPagesRouter.get("/books/:bookId/pages", authMiddleware, getBookPagesController);
bookPagesRouter.get("/books/:bookId/pages/:pageNumber", authMiddleware, getBookPageController);

// only for admin
bookPagesRouter.post(
  "/books/:bookId/pages",
  authMiddleware,
  validateBookPageMiddleware,
  postBookPageController
);
bookPagesRouter.put(
  "/books/:bookId/pages/:pageNumber",
  authMiddleware,
  validateBookPageMiddleware,
  putBookPageController
);
bookPagesRouter.patch(
  "/books/:bookId/pages/:pageNumber",
  authMiddleware,
  validateBookPagePatchMiddleware,
  patchBookPageController
);
bookPagesRouter.delete(
  "/books/:bookId/pages/:pageNumber",
  authMiddleware,
  deleteBookPageController
);

export default bookPagesRouter;
