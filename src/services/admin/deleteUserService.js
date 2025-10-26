import userModel from "../../models/userModel.js";

export const deleteUserService = async (userId, requestingUserId) => {
  const user = await userModel.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === "admin" && userId !== requestingUserId) {
    throw new Error("Cannot delete another admin user");
  }

  await userModel.findByIdAndDelete(userId);

  try {
    const deletedContext = await userContextModel.findOneAndDelete({ userId });
    if (deletedContext) {
      console.log(`User context for ${userId} deleted successfully.`);
    } else {
      console.log(`No user context found for ${userId}.`);
    }
  } catch (err) {
    console.error(`Error deleting user context for ${userId}:`, err);
  }

  return { message: "User and related context deleted successfully" };
};
