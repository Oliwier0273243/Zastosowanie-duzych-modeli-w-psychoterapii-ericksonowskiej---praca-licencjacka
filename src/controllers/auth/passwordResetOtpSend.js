import userModel from "../../models/userModel.js";
import { transporter } from "../../config/nodeMailer.js";

export async function passwordResetOtpSendController(req, res) {
  try {
    const { email } = req.body;

    if (!email) throw new Error("Email is required");

    const user = await userModel.findOne({ email });
    if (!user) throw new Error("User not found");

    const otpCode = String(Math.floor(1000 + Math.random() * 9000));
    user.resetOtp = otpCode;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your password reset code is: ${otpCode}`,
    });

    return res.status(200).json({ success: true, message: "OTP sent to email." });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}
