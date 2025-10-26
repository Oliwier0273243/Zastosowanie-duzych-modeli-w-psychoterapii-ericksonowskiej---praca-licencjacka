export const validateBookMiddleware = async (req, res, next) => {
  const { title, language, author, description, coverUrl, totalPages } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ message: "Book must have a title" });
  }

  if (!language || typeof language !== "string" || language.trim() === "") {
    return res
      .status(400)
      .json({ message: "Language is required and must be a non-empty string." });
  }

  if (author && typeof author !== "string") {
    return res.status(400).json({ message: "Author must be a string" });
  }

  if (description && typeof description !== "string") {
    return res.status(400).json({ message: "Description must be a string" });
  }

  if (coverUrl && typeof coverUrl !== "string") {
    return res.status(400).json({ message: "Cover URL must be a string" });
  }

  if (totalPages !== undefined && (typeof totalPages !== "number" || totalPages <= 0)) {
    return res.status(400).json({ message: "Total pages must me a number and be above 0" });
  }

  next();
};
