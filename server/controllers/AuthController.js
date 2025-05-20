import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

// Token max age: 3 days in milliseconds
const maxAge = 3 * 24 * 60 * 60 * 1000;

// Create JWT token
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

// Signup controller
export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Create user
    const user = await User.create({ email, password });

    // Set JWT cookie
    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // Respond with user data
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: error.message });
  }
};
