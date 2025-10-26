import userContextModel from "../../models/userContextModel.js";
import mongoose from "mongoose";

export const deleteUserContextService = async (userId, currentUserId) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("A valid userId is required");
  }

  if (!currentUserId || !mongoose.Types.ObjectId.isValid(currentUserId)) {
    throw new Error("A valid currentUserId is required");
  }

  try {
    if (userId !== currentUserId.toString()) {
      throw new Error("Access denied. You can only delete your own context.");
    }

    const deleted = await userContextModel.findOneAndDelete({ userId });
    if (!deleted) {
      throw new Error("User context not found");
    }

    return deleted;
  } catch (error) {
    console.error("Error in deleteUserContextService:", error);
    throw error;
  }
};
