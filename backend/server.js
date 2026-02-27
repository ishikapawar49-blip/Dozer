import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import { initSocket } from "./services/socketService.js";
import { startTelemetrySimulator } from "./simulator/telemetrySimulator.js";
import telemetryRoutes from "./routes/telemetryRoutes.js";
import dozerRoutes from "./routes/dozerRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import userRoutes from "./routes/userRoutes.js";
dotenv.config(); // ⭐ MUST BE BEFORE mongoose.connect

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/telemetry", telemetryRoutes);
app.use("/api/dozers", dozerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/users", userRoutes);
/* ===== MongoDB ===== */
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1); // stop server if DB not configured
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("🟢 MongoDB connected");

    // ⭐ start simulator ONLY after DB connected
    startTelemetrySimulator();
  })
  .catch((err) => {
    console.error("Mongo error:", err);
    process.exit(1);
  });

/* ===== HTTP + SOCKET ===== */
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

initSocket(io);

/* ===== SOCKET CONNECTION ===== */
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);
});

/* ===== START SERVER ===== */
server.listen(5000, () => {
  console.log("🚀 Server running on 5000");
});
