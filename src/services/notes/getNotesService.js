import noteModel from "../../models/notesModel.js";

export const getNotesService = async (userId, search, page, limit, sort) => {
  const query = { userId };

  const hasSearch = search && search.trim() !== "";
  if (hasSearch) {
    query.$text = { $search: search };
  }

  const offset = (page - 1) * limit;

  const sortOption = hasSearch ? { score: { $meta: "textScore" }, ...sort } : sort;

  const notes = await noteModel.find(query).sort(sortOption).skip(offset).limit(limit);

  const allNotesCount = await noteModel.countDocuments(query);

  return {
    notes,
    allNotesCount,
    page,
    pages: Math.ceil(allNotesCount / limit),
  };
};
