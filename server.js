import expressApp from "./expressApp.js";
import dotenv from "dotenv";
import { connectWithMongo } from "./src/config/mongoConnection.js";
import { initializePineconeIndexes } from "./src/utils/pinecone/initializePineconeIndexes.js";
import { initializeChatSocket } from "./chatWebsocketServer.js";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const PORT = process.env.PORT || 8000;

const mongoUrl = process.env.MONGODB_URL;

export async function startServer() {
  if (!mongoUrl) throw new Error("MONGODB_URL env variable is not set");

  try {
    await connectWithMongo(mongoUrl);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }

  try {
    await initializePineconeIndexes();
  } catch (pineconeError) {
    console.error("Failed to initialize Pinecone indexes:", pineconeError);
  }

  const httpServer = http.createServer(expressApp);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  initializeChatSocket(io);

  httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
  });

  return { io, httpServer };
}

startServer()
  .then(() => console.log("Server is running"))
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
