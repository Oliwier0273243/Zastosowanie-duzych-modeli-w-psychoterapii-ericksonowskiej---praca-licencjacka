import patientModel from "../../models/patientModel.js";
import { getEmbedding } from "../../utils/embedding.js";
import { upsertVector } from "../../utils/pinecone/upsertVector.js";

export const patchPatientService = async (patientId, updates, userId) => {
  const patient = await patientModel.findById(patientId);
  if (!patient) throw new Error("Patient not found.");
  if (patient.userId.toString() !== userId.toString()) throw new Error("Access denied.");

  Object.assign(patient, updates);
  const savedPatient = await patient.save();

  const p = savedPatient;
  const embeddingContent = `
    Patient: ${p.firstName || ""} ${p.lastName || ""}
    Description: ${p.description || ""}
    Problem: ${p.problem || ""}
    Condition: ${p.condition || ""}
    Status: ${p.patientConditionStatus || ""}
    Problem Description: ${p.problemDescription || ""}
    Summary: ${p.summary || ""}
  `.trim();

  let success = false;
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const vector = await getEmbedding(embeddingContent);
      await upsertVector(
        "patients",
        {
          values: vector,
          metadata: {
            patientId: p._id.toString(),
            userId: p.userId.toString(),
          },
        },
        p._id.toString()
      );
      success = true;
      break;
    } catch (err) {
      lastError = err;
    }
  }

  if (!success) console.error("Failed to upsert patient in Pinecone after 3 attempts:", lastError);

  return savedPatient;
};
