export const validateBookPatchMiddleware = async (req, res, next) => {
  const { title, language, author, description, coverUrl, totalPages } = req.body;

  if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
    return res.status(400).json({ message: "Title must be a non-empty string if provided." });
  }

  if (language !== undefined && (typeof language !== "string" || language.trim() === "")) {
    return res.status(400).json({ message: "Language must be a non-empty string if provided." });
  }

  if (author !== undefined && typeof author !== "string") {
    return res.status(400).json({ message: "Author must be a string if provided." });
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({ message: "Description must be a string if provided." });
  }

  if (coverUrl !== undefined && typeof coverUrl !== "string") {
    return res.status(400).json({ message: "Cover URL must be a string if provided." });
  }

  if (totalPages !== undefined && (typeof totalPages !== "number" || totalPages <= 0)) {
    return res.status(400).json({ message: "Total pages must be a positive number if provided." });
  }

  next();
};
