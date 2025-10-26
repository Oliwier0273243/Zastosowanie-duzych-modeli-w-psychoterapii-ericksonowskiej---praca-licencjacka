import patientModel from "../../models/patientModel.js";

export const getPatientService = async (patientId, userId) => {
  const patient = await patientModel.findById(patientId);

  if (!patient) {
    throw new Error("Patient not found.");
  }

  if (patient.userId.toString() !== userId.toString()) {
    throw new Error("Access denied.");
  }

  return patient;
};
