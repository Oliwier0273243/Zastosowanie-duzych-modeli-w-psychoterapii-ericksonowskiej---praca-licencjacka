import mongoose from "mongoose";

export const validateChatPatchMiddleware = async (req, res, next) => {
  if (!req.body) {
    req.body = {};
  }

  const { title, patientIds } = req.body;

  if (title !== undefined && typeof title !== "string") {
    return res.status(400).json({ message: "Title must be a string if provided." });
  }

  if (patientIds !== undefined) {
    if (
      !Array.isArray(patientIds) ||
      !patientIds.every((id) => mongoose.Types.ObjectId.isValid(id))
    ) {
      return res.status(400).json({ message: "Patient IDs must be a string if provided." });
    }
  }

  next();
};
