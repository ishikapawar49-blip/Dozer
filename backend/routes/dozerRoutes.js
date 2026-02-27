import express from "express";
import {
  createDozer,
  getDozers,
  updateDozer,
  deleteDozer
} from "../controllers/dozerController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
  GET ALL DOZERS
  - Admin → All dozers
  - Owner → Only own dozers
  - (Filtering logic inside controller)
*/
router.get("/", protect, getDozers);

/* CREATE DOZER (Owner/Admin only) */
router.post("/", protect, createDozer);

/* UPDATE DOZER */
router.put("/:id", protect, updateDozer);

/* DELETE DOZER */
router.delete("/:id", protect, deleteDozer);

export default router;