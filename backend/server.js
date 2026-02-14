import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(express.json());

// basic test route
app.get("/", (req, res) => {
  res.send("Dozer Backend Running 🚜");
});

const server = http.createServer(app);

// socket.io setup
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("Client connected");

  // send fake telemetry every 2 seconds
  setInterval(() => {
    const data = {
      dozerId: "DOZ-12345",
      timestamp: new Date(),
      engineOilPressure: +(Math.random() * 8).toFixed(1),
      transmissionOilPressure: +(Math.random() * 3).toFixed(1),
      transmissionOilTemp: +(60 + Math.random() * 60).toFixed(1),
      waterTemp: +(60 + Math.random() * 60).toFixed(1),
      waterLevel: +(Math.random() * 100).toFixed(1),
      batteryStatus: +(11 + Math.random() * 2).toFixed(1),
      batteryCharging: Math.random() > 0.5,
      engineOn: true
    };

    socket.emit("telemetry", data);
  }, 2000);
});

// IMPORTANT: start server
server.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
