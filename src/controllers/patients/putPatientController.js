import { putPatientService } from "../../services/patients/putPatientService.js";

export const putPatientController = async (req, res) => {
  try {
    const replacedPatient = await putPatientService(req.params.patientId, req.body, req.userId);
    res.json(replacedPatient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
