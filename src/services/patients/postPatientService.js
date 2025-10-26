import patientModel from "../../models/patientModel.js";
import { upsertVector } from "../../utils/pinecone/upsertVector.js";
import { getEmbedding } from "../../utils/embedding.js";

export const postPatientService = async (patientData, userId) => {
  const newPatient = new patientModel({ ...patientData, userId });
  const savedPatient = await newPatient.save();

  const embeddingContent = `
    Patient: ${savedPatient.firstName || ""} ${savedPatient.lastName || ""}
    Description: ${savedPatient.description || ""}
    Problem: ${savedPatient.problem || ""}
    Condition: ${savedPatient.condition || ""}
    Status: ${savedPatient.patientConditionStatus || ""}
    Problem Description: ${savedPatient.problemDescription || ""}
    Summary: ${savedPatient.summary || ""}
  `.trim();

  let attempts = 0;
  let success = false;
  let lastError = null;

  while (attempts < 3 && !success) {
    try {
      attempts++;
      const vector = await getEmbedding(embeddingContent);

      const pineconeVector = {
        values: vector,
        metadata: {
          patientId: savedPatient._id.toString(),
          userId: savedPatient.userId.toString(),
        },
      };

      await upsertVector("patients", pineconeVector, savedPatient._id.toString());

      success = true;
    } catch (pineconeError) {
      lastError = pineconeError;
      console.error(
        `Failed to add patient to Pinecone (attempt ${attempts}):`,
        pineconeError.message
      );
      if (attempts < 3) {
        console.log("Retrying...");
      }
    }
  }

  if (!success) {
    console.error("Giving up after 3 failed attempts to add patient to Pinecone.");
    throw lastError;
  }

  return savedPatient;
};
