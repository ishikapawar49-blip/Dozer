import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Dozer from "../models/Dozer.js";

export const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(
      password.trim(),
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // dozer allocation check
    const dozer = await Dozer.findOne({
      driverId: user._id
    });

    if (!dozer) {
      return res.status(403).json({
        message: "No dozer allocated"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user,
      dozer
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
// Profile
export const getMyProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("-password");

    const dozers = await Dozer.find({ driverId: req.user.id });

    res.json({
      ...user.toObject(),
      totalVehicles: dozers.length,
activeVehicles: dozers.filter(d => d.status === "Active").length    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update profile
export const updateMyProfile = async (req, res) => {
  try {

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,

        address: {
          fullAddress: req.body.fullAddress,
          city: req.body.city,
          state: req.body.state,
          pincode: req.body.pincode
        }
      },
      { new: true }
    );

    res.json(updatedUser);

  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};