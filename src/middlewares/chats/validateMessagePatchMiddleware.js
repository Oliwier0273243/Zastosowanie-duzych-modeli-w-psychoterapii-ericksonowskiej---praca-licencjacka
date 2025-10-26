import mongoose from "mongoose";

export const validateMessagePatchMiddleware = async (req, res, next) => {
  if (!req.body) {
    req.body = {};
  }

  const { payload, metadata } = req.body;

  const { chatId } = req.params;
  if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
    return res
      .status(400)
      .json({ message: "Chat ID from URL params is required and must be a valid ObjectId." });
  }

  const role = req.userRole || "therapist";

  if (payload !== undefined) {
    if (typeof payload !== "object" || payload === null) {
      return res.status(400).json({ message: "Payload must be an object if provided." });
    }

    const { title, text } = payload;

    if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
      return res
        .status(400)
        .json({ message: "Payload title must be a non-empty string if provided." });
    }

    if (text !== undefined && (typeof text !== "string" || text.trim() === "")) {
      return res
        .status(400)
        .json({ message: "Payload text must be a non-empty string if provided." });
    }

    if (
      (!title || typeof title !== "string" || title.trim() === "") &&
      (!text || typeof text !== "string" || text.trim() === "")
    ) {
      return res.status(400).json({
        message:
          "At least one of 'payload.title' or 'payload.text' must be provided if payload is provided.",
      });
    }
  }

  if (
    metadata !== undefined &&
    (typeof metadata !== "object" || metadata === null || Array.isArray(metadata))
  ) {
    return res.status(400).json({ message: "Metadata must be an object if provided." });
  }

  next();
};
