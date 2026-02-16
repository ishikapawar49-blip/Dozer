import Telemetry from "../models/telemetryModel.js";
import { emitTelemetry } from "../services/socketService.js";

export const createTelemetry = async (req, res) => {
  try {
    const telemetry = await Telemetry.create(req.body);

    // ✅ realtime emit
    emitTelemetry(telemetry);

    res.status(201).json(telemetry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLatestTelemetry = async (req, res) => {
  try {
    const telemetry = await Telemetry.findOne().sort({ timestamp: -1 });
    res.json(telemetry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
