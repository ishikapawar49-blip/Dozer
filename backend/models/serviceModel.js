import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  dozerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dozer",
    required: true,
  },

  serviceType: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  serviceDate: {
    type: Date,
    required: true,
  },

  cost: {
    type: Number,
    default: 0,
  },

  status: {
    type: String,
    enum: ["Pending", "Approved", "Done"],
    default: "Pending",
  }

}, { timestamps: true });

export default mongoose.model("Service", serviceSchema);