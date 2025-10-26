import { postPatientService } from "../../services/patients/postPatientService.js";

export const postPatientController = async (req, res) => {
  try {
    const newPatient = await postPatientService(req.body, req.userId);
    res.status(201).json(newPatient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
