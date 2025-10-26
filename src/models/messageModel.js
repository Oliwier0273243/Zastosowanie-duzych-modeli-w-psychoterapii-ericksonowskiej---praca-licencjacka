import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    messageIndex: { type: Number, required: false },
    role: { type: String, enum: ["user", "assistant"], default: "user" },
    payload: {
      title: { type: String, default: "" },
      text: { type: String, default: "" },
    },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true }
);

messageSchema.index({ chatId: 1, messageIndex: 1 }, { unique: true });
messageSchema.index({ "payload.title": "text", "payload.text": "text" });

messageSchema.pre("save", async function (next) {
  try {
    if (this.isNew && (this.messageIndex === undefined || this.messageIndex === null)) {
      const lastMessage = await this.constructor
        .find({ chatId: this.chatId })
        .sort({ messageIndex: -1 })
        .limit(1);

      const nextMessageIndex = lastMessage.length ? lastMessage[0].messageIndex + 1 : 1;

      this.messageIndex = nextMessageIndex;
    }
    next();
  } catch (error) {
    console.error("Error in pre-save hook:", error);
    next(error);
  }
});

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;
