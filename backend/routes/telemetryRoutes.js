import express from "express";
import Telemetry from "../models/telemetryModel.js";

const router = express.Router();

/*  Get latest telemetry */
router.get("/all-latest", async (req, res) => {
  try {
    const allTelemetry = await Telemetry.aggregate([
      { $sort: { timestamp: -1 } },

      {
        $group: {
          _id: "$dozerId",  
          latest: { $first: "$$ROOT" }
        }
      },

      {
        $lookup: {
          from: "dozers",           // Dozer collection name
          localField: "_id",        // dozerId
          foreignField: "_id",      // Dozer _id
          as: "dozerDetails"
        }
      },

      { $unwind: "$dozerDetails" },

      {
        $project: {
          _id: 0,
          vehicleNumber: "$dozerDetails.vehicleNumber",
          transmissionOilPressure: "$latest.transmissionOilPressure",
          transmissionOilTemp: "$latest.transmissionOilTemp",
          waterTemp: "$latest.waterTemp",
          waterLevel: "$latest.waterLevel",
          batteryStatus: "$latest.batteryStatus",
          engineOn: "$latest.engineOn"
        }
      }
    ]);

    res.json(allTelemetry);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get latest telemetry by vehicle number
router.get("/:vehicleNumber", async (req, res) => {
  try {
    const { vehicleNumber } = req.params;

    const telemetry = await Telemetry.aggregate([
      { $sort: { timestamp: -1 } },

      {
        $lookup: {
          from: "dozers",
          localField: "dozerId",
          foreignField: "_id",
          as: "dozerDetails",
        },
      },

      { $unwind: "$dozerDetails" },

      {
        $match: {
          "dozerDetails.vehicleNumber": vehicleNumber,
        },
      },

      { $limit: 1 },

      {
        $project: {
          _id: 0,
          vehicleNumber: "$dozerDetails.vehicleNumber",
          transmissionOilPressure: 1,
          transmissionOilTemp: 1,
          waterTemp: 1,
          waterLevel: 1,
          batteryStatus: 1,
          engineOn: 1,
        },
      },
    ]);

    if (!telemetry.length) {
      return res.status(404).json({ message: "No telemetry found" });
    }

    res.json(telemetry[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;