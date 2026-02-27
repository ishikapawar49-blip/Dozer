import Telemetry from "../models/telemetryModel.js";
import { emitTelemetry } from "../services/socketService.js";
import Dozer from "../models/Dozer.js";

export const createTelemetry = async (req, res) => {
  try {
    const { vehicleNumber, ...telemetryData } = req.body;

    // 🔎 Find Dozer using vehicleNumber
    const dozer = await Dozer.findOne({ vehicleNumber });

    if (!dozer) {
      return res.status(404).json({ message: "Dozer not found" });
    }

    // ✅ Save Mongo ObjectId instead of string
    const telemetry = await Telemetry.create({
      ...telemetryData,
      dozerId: dozer._id
    });

    emitTelemetry(telemetry);

    res.status(201).json(telemetry);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
