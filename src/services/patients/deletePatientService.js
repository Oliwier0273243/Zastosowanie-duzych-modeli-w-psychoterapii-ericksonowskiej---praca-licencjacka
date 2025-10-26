import patientModel from "../../models/patientModel.js";
import { deleteVectorByMongoId } from "../../utils/pinecone/deleteVector.js";

export const deletePatientService = async (patientId, userId) => {
  const patient = await patientModel.findById(patientId);
  if (!patient) throw new Error("Patient not found.");
  if (patient.userId.toString() !== userId.toString()) throw new Error("Access denied.");

  await patient.deleteOne();

  let success = false;
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await deleteVectorByMongoId("patients", patientId.toString(), userId, null);
      success = true;
      break;
    } catch (err) {
      lastError = err;
    }
  }

  if (!success)
    console.error("Failed to delete patient from Pinecone after 3 attempts:", lastError);

  return { success: true, deletedId: patientId };
};
