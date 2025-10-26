import express from "express";
import { loginController } from "../controllers/auth/loginController.js";
import { registerController } from "../controllers/auth/registerController.js";
import { logoutController } from "../controllers/auth/logoutController.js";
import { sendOtpController } from "../controllers/auth/sendOtpController.js";
import { verifyOtpController } from "../controllers/auth/verifyEmailController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAuthenticatedController } from "../controllers/auth/isAuthenticatedController.js";
import { resetPasswordController } from "../controllers/auth/resetPassword.js";
import { passwordResetOtpSendController } from "../controllers/auth/passwordResetOtpSend.js";

const authRouter = express.Router();

authRouter.post("/login", loginController);
authRouter.post("/register", registerController);
authRouter.post("/logout", logoutController);

authRouter.post("/send-email-verification", authMiddleware, sendOtpController);
authRouter.post("/email-verification", authMiddleware, verifyOtpController);
authRouter.post("/password-reset", resetPasswordController);
authRouter.post("/send-reset-verification-otp", passwordResetOtpSendController);

authRouter.post("/is-authenticated", authMiddleware, isAuthenticatedController);

export default authRouter;
