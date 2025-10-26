import userContextModel from "../../models/userContextModel.js";
import mongoose from "mongoose";
import { validateUserContextData } from "./validateUserContextData.js";

export const putUserContextService = async (userId, userContextData) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("A valid userId is required");
  }

  try {
    const existingUserContext = await userContextModel.findOne({ userId });

    if (!existingUserContext) {
      throw new Error("User context not found. Use POST to create a new context.");
    }

    if (existingUserContext.userId.toString() !== userId.toString()) {
      throw new Error("Access denied. You can only update your own context.");
    }

    const { data: sanitizedData, isValid, errors } = validateUserContextData(userContextData);

    if (!isValid) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }

    const preservedFields = {
      userId: existingUserContext.userId,
    };

    const updatedData = {
      ...sanitizedData,
      ...preservedFields,
    };

    const updatedContext = await userContextModel.findOneAndUpdate({ userId }, updatedData, {
      new: true,
      overwrite: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    });

    return updatedContext;
  } catch (error) {
    console.error("Error in putUserContextService:", error);
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
