import { deleteUserService } from "../../services/admin/deleteUserService.js";

export const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const result = await deleteUserService(userId, requestingUserId);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    if (err.message === "User not found") {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }

    if (err.message === "Cannot delete another admin user") {
      return res.status(403).json({
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
