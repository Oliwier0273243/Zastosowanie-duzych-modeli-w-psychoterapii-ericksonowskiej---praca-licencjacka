import { patchPatientService } from "../../services/patients/patchPatientService.js";

export const patchPatientController = async (req, res) => {
  try {
    const updatedPatient = await patchPatientService(req.params.patientId, req.body, req.userId);
    res.json(updatedPatient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
