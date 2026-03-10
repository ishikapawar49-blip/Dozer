import Service from "../models/serviceModel.js";
import Dozer from "../models/Dozer.js";
import Notification from "../models/Notification.js";

export const getMyServices = async (req, res) => {
  try {

   const userId = req.user.id || req.user._id;

const dozer = await Dozer.findOne({ driverId: userId });

    if (!dozer) {
      return res.json([]);
    }

    const services = await Service.find({
      dozerId: dozer._id
    }).populate("dozerId", "vehicleNumber");

    res.json(services);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// GET single service (for edit page)

export const getServiceById = async (req, res) => {
  try {

    const service = await Service
      .findById(req.params.id)
      .populate("dozerId", "vehicleNumber");

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    res.json(service);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message
    });
  }
};


export const updateServiceStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const service = await Service.findById(req.params.id).populate("dozerId");

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    service.status = status;
    await service.save();

    const dozer = service.dozerId;   // ⭐ FIX

    if (status === "Completed") {

      await Notification.create({
        user: dozer.driverId,
        message: `Service completed for vehicle ${dozer.vehicleNumber}`,
        type: "service-completed"
      });

    }

    if (status === "Approved") {

      await Notification.create({
        user: dozer.driverId,
        message: `Service approved for vehicle ${dozer.vehicleNumber}`,
        type: "service-approved"
      });

    }

    res.json(service);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

