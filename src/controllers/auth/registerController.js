import userModel from "../../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { postUserContextService } from "../../services/userContext/postUserContextService.js";

export async function registerController(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Name, email, and password are required." });
  }

  try {
    const exists = await userModel.findOne({ email });

    if (exists) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 15);

    const newUser = await userModel.create({ name, email, password: hashedPassword });

    await postUserContextService({ firstName: name }, newUser._id);

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role || "therapist" },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    const isProd = process.env.PRODUCTION === "true";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ success: true, message: "Account successfully created." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
