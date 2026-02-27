import mongoose from "mongoose";

const telemetrySchema = new mongoose.Schema({
  dozerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dozer",
    required: true
  },

  timestamp: { type: Date, default: Date.now },

  engineOilPressure: Number,
  transmissionOilPressure: Number,
  transmissionOilTemp: Number,
  waterTemp: Number,
  waterLevel: Number,
  batteryStatus: Number,
  batteryCharging: Boolean,
  engineOn: Boolean,
});

export default mongoose.model("Telemetry", telemetrySchema);