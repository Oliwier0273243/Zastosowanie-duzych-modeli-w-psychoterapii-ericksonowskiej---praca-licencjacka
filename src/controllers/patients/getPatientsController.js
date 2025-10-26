import { getPatientsService } from "../../services/patients/getPatientsService.js";

export const getPatientsController = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", sortBy = "createdAt", order = "asc" } = req.query;

    const sortOrder = order === "desc" ? -1 : 1;
    const sort = { [sortBy]: sortOrder };

    const patients = await getPatientsService(
      req.userId,
      search,
      parseInt(page),
      parseInt(limit),
      sort
    );

    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
