import jwt from "jsonwebtoken";

export async function authMiddleware(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    const { id, role } = jwt.verify(token, process.env.JWT_SECRET);

    if (!id) throw new Error("Invalid token structure.");

    req.userId = id;
    req.userRole = role || "therapist";

    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid or expired token." });
  }
}
