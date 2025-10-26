import mongoose from "mongoose";

export const validateBookPageMiddleware = async (req, res, next) => {
  const { bookId } = req.params;
  const { content } = req.body;

  if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
    return res
      .status(400)
      .json({ message: "'bookId' param is required and must be a valid ObjectId." });
  }

  if (!content || typeof content !== "string" || content.trim() === "") {
    return res
      .status(400)
      .json({ message: "'content' is required and must be a non-empty string." });
  }

  next();
};
