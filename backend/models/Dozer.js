import mongoose from "mongoose";

const dozerSchema = new mongoose.Schema(
  {
        // 🔥 ADD THIS
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vehicleNumber: { type: String, required: true },
    model: String,
    brand: String,
    year: String,
    expectedLifeYears: Number,   
    purchaseDate: String,
    status: {
  type: String,
  enum: ["Active", "Inactive", "Maintenance"],
  default: "Active",
},

    driverName: { type: String, required: true },
    driverPhone: { type: String, required: true },
    licenseNumber: String,

    lastServiceDate: String,
    nextServiceDate: String,
    serviceCost: String,
  },
  { timestamps: true }
);

export default mongoose.model("Dozer", dozerSchema);
