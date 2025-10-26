import userModel from "../../models/userModel.js";
import bcrypt from "bcrypt";

export async function resetPasswordController(req, res) {
  try {
    const { email, otpCode, newPassword } = req.body;

    if (!email) throw new Error("Email is required");
    if (!otpCode) throw new Error("OTP code is required");
    if (!newPassword) throw new Error("New password is required");

    const user = await userModel.findOne({ email });
    if (!user) throw new Error("User not found");

    if (user.resetOtp !== otpCode) throw new Error("Invalid OTP code");
    if (Date.now() > user.resetOtpExpireAt) throw new Error("OTP has expired");

    const hashedPassword = await bcrypt.hash(newPassword, 15);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password has been reset successfully." });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}
