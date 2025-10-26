import { getUserService } from "../../services/admin/getUserService.js";

export const getUserController = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await getUserService(userId);

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    if (err.message === "User not found") {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
