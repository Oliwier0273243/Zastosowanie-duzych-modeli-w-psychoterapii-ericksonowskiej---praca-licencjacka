import { getUsersService } from "../../services/admin/getUsersService.js";

export const getUsersController = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      sortBy = "createdAt",
      order = "desc",
      isVerified,
      role,
    } = req.query;

    const sortOrder = order === "desc" ? -1 : 1;
    const sort = { [sortBy]: sortOrder };

    const result = await getUsersService(
      parseInt(page),
      parseInt(limit),
      sort,
      isVerified,
      role,
      search
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
