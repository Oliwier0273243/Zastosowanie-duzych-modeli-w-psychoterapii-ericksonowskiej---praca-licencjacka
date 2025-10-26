import mongoose from "mongoose";
import { validateUserContextData } from "./validateUserContextData.js";
import userContextModel from "../../models/userContextModel.js";

export const patchUserContextService = async (targetUserId, updates, currentUserId) => {
  if (!targetUserId || !mongoose.Types.ObjectId.isValid(targetUserId)) {
    throw new Error("A valid targetUserId is required");
  }

  if (!currentUserId || !mongoose.Types.ObjectId.isValid(currentUserId)) {
    throw new Error("A valid currentUserId is required");
  }

  const userContext = await userContextModel.findOne({ userId: targetUserId });

  if (!userContext) {
    throw new Error("User context not found");
  }

  if (userContext.userId.toString() !== currentUserId.toString()) {
    throw new Error("Access denied. You can only update your own context.");
  }

  const protectedFields = ["_id", "userId"];
  protectedFields.forEach((field) => delete updates[field]);

  const { data: sanitizedUpdates, isValid, errors } = validateUserContextData(updates);

  if (!isValid) {
    throw new Error(`Validation failed: ${errors.join(", ")}`);
  }

  try {
    Object.assign(userContext, sanitizedUpdates);
    const savedContext = await userContext.save();

    console.log(`✅ Updated user context for userId: ${targetUserId}`);
    return savedContext;
  } catch (error) {
    console.error("Error in patchUserContextService:", error);
    if (error.name === "ValidationError") {
      throw new Error(
        `Mongoose validation failed: ${Object.values(error.errors)
          .map((e) => e.message)
          .join(", ")}`
      );
    }
    throw error;
  }
};
