import userModel from "../../models/userModel.js";

export async function verifyOtpController(req, res) {
  const { otpCode } = req.body;

  if (!otpCode) return res.status(400).json({ success: false, message: "OTP code is required." });

  try {
    const user = await userModel.findById(req.userId);

    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    if (user.verifyOtp !== otpCode) {
      return res.status(400).json({ success: false, message: "Incorrect OTP code." });
    }

    if (Date.now() > user.verifyOtpExireAt) {
      return res.status(410).json({ success: false, message: "OTP code expired." });
    }

    user.isVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExireAt = 0;

    await user.save();

    return res.status(200).json({ success: true, message: "Email verified successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
