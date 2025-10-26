import { transporter } from "../../config/nodeMailer.js";
import userModel from "../../models/userModel.js";

export async function sendOtpController(req, res) {
  try {
    const user = await userModel.findById(req.userId);

    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    if (user.isVerified)
      return res.status(409).json({ success: false, message: "Account already verified." });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.verifyOtp = otp;

    user.verifyOtpExireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Email Verification",
      text: `Your verification code is: ${otp}`,
    });

    return res.status(200).json({ success: true, message: "OTP sent to email." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
