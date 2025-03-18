import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const getUserDetails = async (token) => {
  if (!token) {
    return { message: "Session out", logout: true };
  }

  try {
    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decode.id).select('-password');

    if (!user) {
      return { message: "User not found", logout: true };
    }

    return user;
  } catch (error) {
    return { message: "Invalid token", logout: true };
  }
};

export default getUserDetails;