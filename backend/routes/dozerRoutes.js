import express from "express";
import {
  createDozer,
  getDozers,
  updateDozer,
  deleteDozer,
  getDozerByDriver,
  getMyDozer,
  getDozerById
} from "../controllers/dozerController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* GET ALL DOZERS */
router.get("/my-dozer", protect, getMyDozer);
router.get("/driver/:id", getDozerByDriver);
router.get("/", protect, getDozers);
router.get("/:id", protect, getDozerById);
router.post("/", protect, createDozer);
router.put("/:id", protect, updateDozer);
router.delete("/:id", protect, deleteDozer);
export default router;