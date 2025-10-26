import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, default: "" },
    dateOfBirth: { type: String, default: "" },
    email: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    description: { type: String, default: "" },
    problem: { type: String, default: "" },
    condition: { type: String, default: "" },
    patientConditionStatus: {
      type: String,
      enum: [
        "normal",
        "stable",
        "in_danger",
        "suicidal",
        "depressed",
        "anxious",
        "manic",
        "psychotic",
        "hospitalized",
        "under_observation",
        "undefined",
        "custom",
      ],
      default: "normal",
    },
    problemDescription: { type: String, default: "" },
    quantityOfVisits: { type: Number, default: 0 },
    summary: { type: String, default: "" },
  },
  { timestamps: true }
);

patientSchema.index({ userId: 1 });

patientSchema.index({
  firstName: "text",
  lastName: "text",
  dateOfBirth: "text",
  email: "text",
  phoneNumber: "text",
  description: "text",
  problem: "text",
  condition: "text",
  patientConditionStatus: "text",
  problemDescription: "text",
  summary: "text",
});

const patientModel = mongoose.model("Patient", patientSchema);

export default patientModel;
