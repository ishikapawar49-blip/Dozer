import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Dozer from "../models/Dozer.js";
import { loginUser, getMyProfile, updateMyProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  res.json(user);
});

/* LOGIN */
router.post("/login", loginUser);

/* GET LOGGED IN USER PROFILE */
router.get("/me", protect, getMyProfile);

router.put("/me", protect, updateMyProfile);
/* ================= ADMIN USER CRUD ================= */

/* CREATE USER */
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, dob, license } = req.body;

    // check existing user
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // DOB format check
    const dobRegex = /^\d{2}-\d{2}-\d{4}$/;

    if (!dobRegex.test(dob)) {
      return res.status(400).json({
        message: "DOB must be DD-MM-YYYY"
      });
    }

    // password = DOB
    const hashedPassword = await bcrypt.hash(dob.trim(), 10);

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      phone,
      dob,
      license,
      password: hashedPassword
    });

    res.json(user);

  } catch (err) {
    console.error("CREATE USER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* GET ALL USERS */
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

/* GET SINGLE USER */
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

/* UPDATE USER */
router.put("/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(user);
});

/* DELETE USER */
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});



export default router;
