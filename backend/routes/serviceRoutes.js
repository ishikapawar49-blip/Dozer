import express from "express";
import Service from "../models/serviceModel.js";
import { getMyServices, getServiceById, updateServiceStatus } from "../controllers/serviceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* 🔹 Add New Service */
router.post("/", async (req, res) => {
  try {
    const { dozerId, serviceType, description, serviceDate, cost } = req.body;
const service = await Service.create({
  dozerId,
  serviceType,
  description,
  serviceDate: new Date(serviceDate),
  cost: Number(cost),
  status: "Pending"
});
    res.status(201).json(service);
  } catch (err) {
console.log("SERVICE CREATE ERROR:", err);
res.status(500).json({ error: err.message });  }
});

/* Driver Services */
router.get("/my-services", protect, getMyServices);


// ⭐ ADD THIS
router.get("/:id", protect, getServiceById);
/* Update Status (ADMIN) */
// router.put("/:id/status", updateServiceStatus);
/* Update Status */
router.put("/:id", updateServiceStatus);

/* 🔹 Get All Services */
router.get("/", async (req, res) => {
  try {
   const services = await Service.find()
  .populate({
    path: "dozerId",
    select: "vehicleNumber driverId",
    populate: {
      path: "driverId",
      select: "name phone email"
    }
  });
  
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 🔹 Get Single Service By ID */
// router.get("/:id", async (req, res) => {
//   try {
//     const service = await Service.findById(req.params.id)
//       .populate("dozerId", "vehicleNumber");

//     if (!service) {
//       return res.status(404).json({ message: "Service not found" });
//     }

//     res.json(service);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


/* 🔹 Update Service */
// router.put("/:id", async (req, res) => {
//   try {
//     const updatedService = await Service.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     if (!updatedService) {
//       return res.status(404).json({ message: "Service not found" });
//     }

//     res.json(updatedService);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


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