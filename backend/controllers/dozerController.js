import mongoose from "mongoose";
import Dozer from "../models/Dozer.js";

/* CREATE */

// export const createDozer = async (req, res) => {
//   try {
//     let ownerId;

//     // ✅ If admin is adding dozer
//     if (req.user.role === "admin") {
//       ownerId = req.body.owner; // admin selects owner
//     } 
//     // ✅ If owner is adding dozer
//     else {
//       ownerId = req.user.id; // auto assign
//     }

//     const dozer = await Dozer.create({
//       ...req.body,
//       owner: ownerId,
//     });

//     res.status(201).json(dozer);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };
export const createDozer = async (req, res) => {
  try {

    const dozer = await Dozer.create(req.body);

    res.status(201).json(dozer);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// new

// export const createDozer = async (req, res) => {
//   try {
//     const dozer = await Dozer.create(req.body);
//     res.status(201).json(dozer);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

/* READ ALL */
export const getDozers = async (req, res) => {
  try {
    const dozers = await Dozer.find()
      .sort({ createdAt: -1 });

    res.json(dozers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE */
export const updateDozer = async (req, res) => {
  try {
    const updated = await Dozer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* DELETE */
export const deleteDozer = async (req, res) => {
  try {
    await Dozer.findByIdAndDelete(req.params.id);
    res.json({ message: "Dozer deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// popup
export const getDozerByDriver = async (req, res) => {
  try {

    const dozer = await Dozer.findOne({
      driverId: req.params.id
    });

    if (!dozer) {
      return res.status(404).json(null);
    }

    res.json(dozer);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyDozer = async (req, res) => {
  try {

    const dozer = await Dozer.findOne({
      driverId: req.user.id
    });

    if (!dozer) {
      return res.status(404).json({
        message: "No dozer allocated"
      });
    }

    res.json(dozer);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDozerById = async (req, res) => {
  try {

    const dozer = await Dozer.findById(req.params.id);

    if (!dozer) {
      return res.status(404).json({ message: "Dozer not found" });
    }

    res.json(dozer);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};