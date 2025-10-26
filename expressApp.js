import express from "express";
import cors from "cors";
import authRouter from "./src/routes/authRoutes.js";
import cookieParser from "cookie-parser";
import patientsRouter from "./src/routes/patientRoutes.js";
import notesRouter from "./src/routes/notesRoutes.js";
import chatsRouter from "./src/routes/chats/chatRoutes.js";
import messagesRouter from "./src/routes/chats/messagesRoutes.js";
import booksRouter from "./src/routes/books/bookRoutes.js";
import bookPagesRouter from "./src/routes/books/bookPageRoutes.js";
import adminUserRouter from "./src/routes/admin/userRoutes.js";
import agentsTestRouter from "./src/routes/agentsTestRoutes.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:8000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api", patientsRouter);
app.use("/api", notesRouter);
app.use("/api", chatsRouter);
app.use("/api", messagesRouter);

app.use("/api", booksRouter);
app.use("/api", bookPagesRouter);
app.use("/api", adminUserRouter);

app.use("/priv", agentsTestRouter);

export default app;
