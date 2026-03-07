import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from DB
const user = await User.findById(decoded.id).select("-password");

// Agar user DB me nahi mila to bhi request allow karo
if (!user) {
  req.user = { id: decoded.id };
} else {
  req.user = {
    id: user._id,
    role: user.role
  };
}

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Token failed" });
  }
};