import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
  name: String,

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  phone: String,
  dob: String,
  license: String,

  address: {
    fullAddress: String,
    city: String,
    state: String,
    pincode: String
  }

},
{ timestamps: true }
);

export default mongoose.model("User", userSchema);