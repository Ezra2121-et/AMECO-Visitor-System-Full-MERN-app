import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import visitorRoutes from "./routes/visitorRoutes.js";
import sourceRoutes from "./routes/sourceRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => res.send("AMECO Visitor API running"));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/sources", sourceRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/settings", settingsRoutes);

const port = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(port, () => console.log(`🚀 Server listening on http://localhost:${port}`));
});
