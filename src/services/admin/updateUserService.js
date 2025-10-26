import userModel from "../../models/userModel.js";

export const updateUserService = async (userId, updateData) => {
  const user = await userModel.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const allowedFields = ["name", "email", "role"];
  const filteredUpdateData = {};

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      filteredUpdateData[field] = updateData[field];
    }
  }

  const updatedUser = await userModel
    .findByIdAndUpdate(userId, { $set: filteredUpdateData }, { new: true, runValidators: true })
    .select("-password -verifyOtp -resetOtp -verifyOtpExireAt -resetOtpExpireAt");

  return updatedUser;
};
