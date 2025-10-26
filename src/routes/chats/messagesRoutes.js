import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { validateMessageMiddleware } from "../../middlewares/chats/validateMessageMiddleware.js";
import { validateMessagePatchMiddleware } from "../../middlewares/chats/validateMessagePatchMiddleware.js";
import { getMessagesController } from "../../controllers/chats/messages/getMessagesController.js";
import { getMessageController } from "../../controllers/chats/messages/getMessageController.js";
import { postMessageController } from "../../controllers/chats/messages/postMessageController.js";
import { putMessageController } from "../../controllers/chats/messages/putMessageController.js";
import { patchMessageController } from "../../controllers/chats/messages/patchMessageController.js";
import { deleteMessageController } from "../../controllers/chats/messages/deleteMessageController.js";

const messagesRouter = express.Router();

messagesRouter.get("/chats/:chatId/messages", authMiddleware, getMessagesController);
messagesRouter.get("/chats/:chatId/messages/:messageNumber", authMiddleware, getMessageController);

messagesRouter.post(
  "/chats/:chatId/messages",
  authMiddleware,
  validateMessageMiddleware,
  postMessageController
);
messagesRouter.put(
  "/chats/:chatId/messages/:messageNumber",
  authMiddleware,
  validateMessageMiddleware,
  putMessageController
);
messagesRouter.patch(
  "/chats/:chatId/messages/:messageNumber",
  authMiddleware,
  validateMessagePatchMiddleware,
  patchMessageController
);
messagesRouter.delete(
  "/chats/:chatId/messages/:messageNumber",
  authMiddleware,
  deleteMessageController
);

export default messagesRouter;
