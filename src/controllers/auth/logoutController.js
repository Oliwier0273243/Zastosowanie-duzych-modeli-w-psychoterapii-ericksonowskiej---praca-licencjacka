export async function logoutController(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.PRODUCTION === "true",
      sameSite: process.env.PRODUCTION === "true" ? "strict" : "lax",
    });

    return res.status(200).json({ success: true, message: "Successfully logged out." });
  } catch {
    return res.status(500).json({ success: false, message: "Unexpected server error." });
  }
}
