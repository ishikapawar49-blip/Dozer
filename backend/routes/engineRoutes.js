import express from "express";

const router = express.Router();

let engineState = true;

// GET current engine state
router.get("/", (req, res) => {
  res.json({ engineOn: engineState });
});

// TOGGLE engine
router.post("/toggle", (req, res) => {
  engineState = !engineState;
  res.json({ engineOn: engineState });
});

export const getEngineState = () => engineState;

export default router;
