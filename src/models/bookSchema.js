import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, default: "" },
    language: { type: String, default: "pl" },
    description: { type: String, default: "" },
    coverUrl: { type: String, default: "" },
    totalPages: { type: Number, default: 0 },
  },
  { timestamps: true }
);

bookSchema.index({
  title: "text",
  author: "text",
  description: "text",
});

const bookPageSchema = new mongoose.Schema(
  {
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    pageNumber: { type: Number, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

bookPageSchema.index({ bookId: 1, pageNumber: 1 }, { unique: true });
bookPageSchema.index({ content: "text" });

bookPageSchema.pre("save", async function (next) {
  if (this.isNew && (this.pageNumber === undefined || this.pageNumber === null)) {
    const lastPage = await this.constructor
      .find({ bookId: this.bookId })
      .sort({ pageNumber: -1 })
      .limit(1);
    this.pageNumber = lastPage.length ? lastPage[0].pageNumber + 1 : 1;
  }
  next();
});

const bookModel = mongoose.model("Book", bookSchema);
const bookPageModel = mongoose.model("BookPage", bookPageSchema);

export { bookModel, bookPageModel };
