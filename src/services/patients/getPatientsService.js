import patientModel from "../../models/patientModel.js";

export const getPatientsService = async (userId, search = "", page = 1, limit = 10, sort = {}) => {
  const query = { userId };

  const hasSearch = search.trim() !== "";
  if (hasSearch) {
    query.$text = { $search: search };
  }

  const skip = (page - 1) * limit;
  const sortOption = hasSearch ? { score: { $meta: "textScore" }, ...sort } : sort;

  const patients = await patientModel.find(query).sort(sortOption).skip(skip).limit(limit);
  const allPatientsCount = await patientModel.countDocuments(query);

  return {
    patients,
    allPatientsCount,
    page,
    pages: Math.ceil(allPatientsCount / limit),
  };
};
