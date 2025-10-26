import { getPatientService } from "../../services/patients/getPatientService.js";

export const getPatientController = async (req, res) => {
  try {
    const patient = await getPatientService(req.params.patientId, req.userId);
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
