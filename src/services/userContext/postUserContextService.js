import mongoose from "mongoose";
import userContextModel from "../../models/userContextModel.js";
import { validateUserContextData } from "./validateUserContextData.js";

export const postUserContextService = async (userContextData, userId) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("A valid userId is required");
  }

  const existingContext = await userContextModel.findOne({ userId });
  if (existingContext) {
    throw new Error("User context already exists. Use PATCH or PUT to update.");
  }

  const { data: sanitizedData, isValid, errors } = validateUserContextData(userContextData);

  if (!isValid) {
    throw new Error(`Validation failed: ${errors.join(", ")}`);
  }
  console.log("sanitizedData", sanitizedData);

  try {
    const newUserContext = new userContextModel({
      ...sanitizedData,
      userId,
    });

    const savedContext = await newUserContext.save();

    return savedContext;
  } catch (error) {
    console.error("Error in postUserContextService:", error);
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
