import userModel from "../../models/userModel.js";

export const getUserService = async (userId) => {
  const user = await userModel
    .findById(userId)
    .select("-password -verifyOtp -resetOtp -verifyOtpExireAt -resetOtpExpireAt");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
