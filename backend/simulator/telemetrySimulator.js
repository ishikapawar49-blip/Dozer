import Telemetry from "../models/telemetryModel.js";
import { emitTelemetry } from "../services/socketService.js";

const random = (min, max) => Number((Math.random() * (max - min) + min).toFixed(1));

export const startTelemetrySimulator = () => {
  setInterval(async () => {
    try {
      const data = {
        dozerId: "DOZ-12345",

        engineOilPressure: random(0.5, 8.5),
        transmissionOilPressure: random(0, 35),
        transmissionOilTemp: random(40, 140),
        waterTemp: random(40, 120),
        waterLevel: random(10, 100),
        batteryStatus: random(11.5, 13),
        batteryCharging: Math.random() > 0.5,
        engineOn: true,
      };

      // ✅ Save to MongoDB
      const saved = await Telemetry.create(data);

      // ✅ Emit realtime to frontend
      emitTelemetry(saved);

      console.log("📡 Telemetry emitted");
    } catch (err) {
      console.error("Simulator error:", err);
    }
  }, 2000); // every 2 sec realtime
};
