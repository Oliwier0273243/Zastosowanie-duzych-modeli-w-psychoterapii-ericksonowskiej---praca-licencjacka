import mongoose from "mongoose";

export async function connectWithMongo(url) {
  try {
    await mongoose.connect(url);
    console.log("Mongoose connected");
  } catch (error) {
    console.error("Mongoose connection error:", error);
    process.exit(1);
  }
}
