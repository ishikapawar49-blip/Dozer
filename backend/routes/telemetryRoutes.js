import express from "express";
import Telemetry from "../models/telemetryModel.js";

const router = express.Router();

/* 🔹 Get latest telemetry */
router.get("/latest", async (req, res) => {
  try {
    const latest = await Telemetry
      .findOne()
      .sort({ createdAt: -1 });

    if (!latest) {
      return res.status(404).json({ message: "No telemetry yet" });
    }

    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
