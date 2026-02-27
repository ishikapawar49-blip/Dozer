import express from "express";
import Service from "../models/serviceModel.js";

const router = express.Router();

/* 🔹 Add New Service */
router.post("/", async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 🔹 Get All Services */
router.get("/", async (req, res) => {
  try {
    const services = await Service.find()
      .populate("dozerId", "vehicleNumber");
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 🔹 Get Single Service By ID */
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate("dozerId", "vehicleNumber");

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* 🔹 Update Service */
router.put("/:id", async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(updatedService);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* 🔹 Delete Service */
router.delete("/:id", async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);

    if (!deletedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;