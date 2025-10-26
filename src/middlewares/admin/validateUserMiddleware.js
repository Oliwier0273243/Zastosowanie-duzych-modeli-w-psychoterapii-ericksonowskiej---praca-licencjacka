export const validateUserPatchDataMiddleware = (req, res, next) => {
  const { name, email, role } = req.body;

  if (!name && !email && !role) {
    return res.status(400).json({
      success: false,
      message: "At least one field (name, email, or role) must be provided for update",
    });
  }

  const forbiddenFields = ["password", "isVerified", "verifyOtp", "resetOtp"];
  const providedForbiddenFields = forbiddenFields.filter((field) => req.body.hasOwnProperty(field));

  if (providedForbiddenFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `The following fields cannot be updated: ${providedForbiddenFields.join(", ")}`,
    });
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }
  }

  if (name && name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Name must be at least 2 characters long",
    });
  }

  // Validate role if provided
  if (role) {
    const validRoles = ["admin", "therapist"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be either 'admin' or 'therapist'",
      });
    }
  }

  next();
};
