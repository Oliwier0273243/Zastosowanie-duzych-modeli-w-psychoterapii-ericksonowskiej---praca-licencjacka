import mongoose from "mongoose";

const userContextSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    firstName: { type: String },
    interests: { type: [String], default: [] },
    longTermGoals: { type: [String], default: [] },
    recentIssues: { type: [String], default: [] },
    chatResponsePreferences: { type: String, default: "" },
    otherImportantInfo: { type: String, default: "" },
  },
  { timestamps: true }
);

const userContextModel = mongoose.model("UserContext", userContextSchema);

export default userContextModel;
