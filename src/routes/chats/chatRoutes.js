import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { getChatsController } from "../../controllers/chats/getChatsController.js";
import { getChatController } from "../../controllers/chats/getChatController.js";
import { postChatController } from "../../controllers/chats/postChatController.js";
import { patchChatController } from "../../controllers/chats/patchChatController.js";
import { putChatController } from "../../controllers/chats/putChatController.js";
import { deleteChatController } from "../../controllers/chats/deleteChatController.js";
import { validateChatMiddleware } from "../../middlewares/chats/validateChatMiddleware.js";
import { validateChatPatchMiddleware } from "../../middlewares/chats/validateChatPatchMiddleware.js";

const chatsRouter = express.Router();

chatsRouter.get("/chats", authMiddleware, getChatsController);
chatsRouter.get("/chats/:chatId", authMiddleware, getChatController);
chatsRouter.post("/chats", authMiddleware, validateChatMiddleware, postChatController);
chatsRouter.patch(
  "/chats/:chatId",
  authMiddleware,
  validateChatPatchMiddleware,
  patchChatController
);
chatsRouter.put("/chats/:chatId", authMiddleware, validateChatMiddleware, putChatController);
chatsRouter.delete("/chats/:chatId", authMiddleware, deleteChatController);

export default chatsRouter;
