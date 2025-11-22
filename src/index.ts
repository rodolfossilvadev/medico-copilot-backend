import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { transcribeRouter } from "./routes/transcribe";
import { diagnoseRouter } from "./routes/diagnose";

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/transcribe", transcribeRouter);
app.use("/api/diagnose", diagnoseRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
