import { deletePatientService } from "../../services/patients/deletePatientService.js";

export const deletePatientController = async (req, res) => {
  try {
    await deletePatientService(req.params.patientId, req.userId);
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
