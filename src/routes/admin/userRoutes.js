import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { adminRoleMiddleware } from "../../middlewares/adminMiddleware.js";
import { validateUserPatchDataMiddleware } from "../../middlewares/admin/validateUserMiddleware.js";
import { getUsersController } from "../../controllers/admin/getUsersController.js";
import { getUserController } from "../../controllers/admin/getUserController.js";
import { patchUserController } from "../../controllers/admin/updateUserController.js";
import { deleteUserController } from "../../controllers/admin/deleteUserController.js";

const adminUserRouter = express.Router();

adminUserRouter.get("/admin/users", authMiddleware, adminRoleMiddleware, getUsersController);
adminUserRouter.get("/admin/users/:userId", authMiddleware, adminRoleMiddleware, getUserController);
adminUserRouter.patch(
  "/admin/users/:userId",
  authMiddleware,
  adminRoleMiddleware,
  validateUserPatchDataMiddleware,
  patchUserController
);
adminUserRouter.delete(
  "/admin/users/:userId",
  authMiddleware,
  adminRoleMiddleware,
  deleteUserController
);

export default adminUserRouter;
