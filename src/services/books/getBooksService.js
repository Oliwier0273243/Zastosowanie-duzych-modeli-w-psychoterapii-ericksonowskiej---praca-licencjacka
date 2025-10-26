import { bookModel } from "../../models/bookSchema.js";

export const getBooksService = async (search, page, limit, sort) => {
  const query = {};

  const hasSearch = search && search.trim() !== "";
  if (hasSearch) {
    query.$text = { $search: search };
  }

  const offset = (page - 1) * limit;

  const sortOption = hasSearch ? { score: { $meta: "textScore" }, ...sort } : sort;

  const books = await bookModel.find(query).sort(sortOption).skip(offset).limit(limit);

  const allBooksCount = await bookModel.countDocuments(query);

  return {
    books,
    allBooksCount,
    page,
    pages: Math.ceil(allBooksCount / limit),
  };
};
