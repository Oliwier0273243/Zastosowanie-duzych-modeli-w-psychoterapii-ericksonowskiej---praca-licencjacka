import mongoose from "mongoose";

export async function validateNoteMiddleware(req, res, next) {
  let { title, text, status, chatId, patientId } = req.body;

  const hasValidText = typeof text === "string" && text.trim() !== "";
  const hasValidTitle = typeof title === "string" && title.trim() !== "";

  if (!hasValidText && !hasValidTitle) {
    return res.status(400).json({
      message: "At leas one of 'text' of 'title' fields must be provided and be non-empty string.",
    });
  }

  if (!hasValidTitle && hasValidText) {
    title = generateTitleFromText(text);
    req.body.title = title;
  }

  const allowedStatuses = ["draft", "final"];
  if (status !== undefined && status !== null) {
    if (typeof status !== "string" || !allowedStatuses.includes(status)) {
      return res
        .status(400)
        .json({ message: "The note status field must be a valid status string." });
    }
  }

  if (chatId !== undefined && chatId !== null && chatId !== "") {
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ message: "The 'chatId' field must be a valid ObjectId." });
    }
  }

  if (patientId !== undefined && patientId !== null && patientId !== "") {
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: "The 'patientId' field must be a valid ObjectId." });
    }
  }

  next();
}
