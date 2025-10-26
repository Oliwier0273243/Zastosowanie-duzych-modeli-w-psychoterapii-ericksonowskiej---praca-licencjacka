import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, minLength: 1 },
    text: { type: String, required: true, minLength: 0 },
    status: { type: String, enum: ["draft", "final"], default: "draft" },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  },
  { timestamps: true }
);

noteSchema.index({ chatId: 1 });
noteSchema.index({ patientId: 1 });

noteSchema.index({
  title: "text",
  text: "text",
  status: "text",
});

const noteModel = mongoose.model("Note", noteSchema);

export default noteModel;
