import express from "express";
import Notification from "../models/Notification.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {

  const notifications = await Notification.find({
    user: req.user.id
  })
  .sort({ createdAt: -1 })
  .limit(10);

  res.json(notifications);

});

export default router;