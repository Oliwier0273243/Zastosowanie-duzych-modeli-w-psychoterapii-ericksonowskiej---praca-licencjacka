import userModel from "../../models/userModel.js";

export const getUsersService = async (page, limit, sort, isVerified, role, search) => {
  const query = {};

  if (isVerified !== undefined) {
    query.isVerified = isVerified === "true";
  }

  if (role && role !== "all") {
    query.role = role;
  }

  if (search && search.trim() !== "") {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const users = await userModel
    .find(query)
    .select("-password -verifyOtp -resetOtp -verifyOtpExireAt -resetOtpExpireAt")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const totalUsers = await userModel.countDocuments(query);

  return {
    users,
    totalUsers,
    page,
    pages: Math.ceil(totalUsers / limit),
  };
};
