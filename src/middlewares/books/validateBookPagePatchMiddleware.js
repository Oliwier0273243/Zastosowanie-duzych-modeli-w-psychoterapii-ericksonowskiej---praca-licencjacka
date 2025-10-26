import mongoose from "mongoose";

export const validateBookPagePatchMiddleware = async (req, res, next) => {
  const { content } = req.body;

  if (content !== undefined && (typeof content !== "string" || content.trim() === "")) {
    return res.status(400).json({ message: "Content must be a non-empty string if provided." });
  }

  next();
};
