import User from "../routes/AuthRoutes.js";
import jwt from "jsonwebtoken";

const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 days
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};
export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }
    const user = await User.create({ email, password });
    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "none",
    });
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        // firstName: user.firstName,
        // lastName: user.lastName,
        // image: user.image,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
