import userContextModel from "../../models/userContextModel.js";
import mongoose from "mongoose";

export const getUserContextService = async (userId) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("A valid userId is required");
  }

  try {
    let userContext = await userContextModel.findOne({ userId });

    if (!userContext) {
      console.log(`Creating default user context for userId: ${userId}`);
      userContext = await userContextModel.create({
        userId,
      });
    }

    return userContext;
  } catch (error) {
    console.error("Error in getUserContextService:", error);
    if (error.name === "ValidationError") {
      throw new Error(
        `Database validation failed: ${Object.values(error.errors)
          .map((e) => e.message)
          .join(", ")}`
      );
    }
    throw error;
  }
};

export const buildAIContextString = (userContext) => {
  if (!userContext) return "No user context available.";

  const parts = [];

  if (userContext.firstName || userContext.lastName) {
    const fullName = `${userContext.firstName || ""} ${userContext.lastName || ""}`.trim();
    if (fullName) {
      parts.push(`Name: ${fullName}`);
    }
  }

  if (userContext.interests?.length > 0) {
    parts.push(`Interests: ${userContext.interests.join(", ")}`);
  }

  if (userContext.longTermGoals?.length > 0) {
    parts.push(`Long-term goals: ${userContext.longTermGoals.join(", ")}`);
  }

  if (userContext.recentIssues?.length > 0) {
    parts.push(`Recent issues: ${userContext.recentIssues.join(", ")}`);
  }

  if (userContext.chatResponsePreferences) {
    parts.push(`Response preferences: ${userContext.chatResponsePreferences}`);
  }

  if (userContext.otherImportantInfo) {
    parts.push(`Additional notes: ${userContext.otherImportantInfo}`);
  }

  return parts.length > 0 ? parts.join("\n") : "Basic user profile with default preferences.";
};
