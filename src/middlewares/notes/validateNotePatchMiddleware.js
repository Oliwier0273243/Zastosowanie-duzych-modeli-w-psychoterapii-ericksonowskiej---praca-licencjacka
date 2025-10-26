import mongoose from "mongoose";

export async function validateNotePatchMiddleware(req, res, next) {
  const { title, text, status, chatId, patientId } = req.body;

  if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
    return res.status(400).json({ message: "'title' must be a non-empty string if provided." });
  }

  if (text !== undefined && (typeof text !== "string" || text.trim() === "")) {
    return res.status(400).json({ message: "'text' must be a non-empty string if provided." });
  }

  const allowedStatuses = ["draft", "final"];
  if (status !== undefined && (typeof status !== "string" || !allowedStatuses.includes(status))) {
    return res
      .status(400)
      .json({ message: "'status' must be one of: " + allowedStatuses.join(", ") });
  }

  if (chatId !== undefined && chatId !== null && chatId !== "") {
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ message: "'chatId' must be a valid ObjectId." });
    }
  }

  if (patientId !== undefined && patientId !== null && patientId !== "") {
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: "'patientId' must be a valid ObjectId." });
    }
  }

  next();
}
