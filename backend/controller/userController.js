import validator from "validator";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import getUserDetails from "../helpers/getUserDetailsFromToken.js";

const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
const userRegister = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    const isUserExist = await userModel.findOne({ email });
    if (isUserExist) {
      return res.json({ message: "User already exist", success: false });
    }
    if (!validator.isEmail(email)) {
      return res.json({ message: "Enter valid email", success: false });
    }
    if (password.length < 8) {
      return res.json({ message: "Enter strong password", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    const user = await newUser.save();
    const token = generateToken(user._id, user?.email);
    return res.json({
      user,
      message: "User created successfully",
      success: true,
      token,
    });
  } catch (error) {
    console.log("Failed to register:", error);
    return res.json({ message: error.message, success: false });
  }
};

//verify email

const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email }).select("-password");
    if (!user) {
      return res.json({ message: "User not exist", success: false });
    }
    return res.json({ user, message: "Email verified", success: true });
  } catch (error) {
    console.log("Failed to verify email:", error);
    return res.json({ message: error.message, success: false });
  }
};

// Verify password

const verifyPassword = async (req, res) => {
  try {
    const { password, userId } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ message: "User not found", success: false });
    }

    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword) {
      return res.json({ message: "Password is wrong", success: false });
    }

    const token = generateToken(user._id, user.email);
    const cookieOptions = {
      http: true,
      secure: true,
    };

    res.cookie("token", token, cookieOptions);
    return res.json({
      user,
      message: "Login successful",
      success: true,
      token,
    });
  } catch (error) {
    return res.json({ message: error.message });
  }
};

// Get user details
const userDetails = async (req, res) => {
  try {
    const token = req.cookies.token || "";
    // const token = req?.body?.token
   
    const user = await getUserDetails(token);
    if (!user) {
      return res.json({
        message: "User not found or session expired",
        success: false,
      });
    }

    return res.json({ user, message: "User details", success: true,token });
  } catch (error) {
    console.error("Failed to get user detail:", error); // Changed to console.error for logging errors
    return res.json({ message: error.message || error, success: false });
  }
};

//user logout
const logout = async (req, res) => {
  try {
    const cookieOptions = {
      http: true,
      secure: true,
    };
    return res
      .cookie("token", "", cookieOptions)
      .json({ message: "Sesstion out", logout: true });
  } catch (error) {
    res.json({ message: error.message || error, success: false });
  }
};

//update user details

const updateUserDetails = async (req, res) => {
  try {
    const token = req.cookies.token || "";
    const user = await getUserDetails(token);
    if (!user) return res.json({ message: "user not found", success: false });

    const { name, avatar } = req.body;
    await userModel.updateOne({ _id: user._id }, { name, avatar });
    const updatedUser = await userModel.findOne(user._id).select("-password");
    return res.json({
      updatedUser,
      message: "User details updated",
      success: true,
    });
  } catch (error) {
    return res.json({ message: error.message || error, success: false });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { search } = req.body;
  
    const query = new RegExp(search, "i", "g");
    const users = await userModel.find({
      $or: [{ name: query }, { email: query }],
    }).select('-password')

    return res.json({ users, success: true });
  } catch (error) {
    console.log("failed to search users:", error);
    return res.json({ message: error.message || error, success: true });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUser = await userModel.find({});
    if (allUser) {
      return res.json({ allUser, success: true });
    }
  } catch (error) {
    console.log("Failed to get all users:", error);
    return res.json({ message: error.message || error, success: false });
  }
};
// const userLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return res.json({ message: "User not exist", success: false });
//     }
//     const isMatch = await bcrypt.compare(password, user?.password);
//     if (isMatch) {
//       const token = generateToken(user._id);
//       return res.json({ message: "Login successful", success: true, token });
//     } else {
//       return res.json({ message: "Invalid email or password", success: false });
//     }
//   } catch (error) {
//     console.log("Failed to login:", error);
//     return res.json({ message: error.message, success: false });
//   }
// };

export {
  userRegister,
  verifyEmail,
  verifyPassword,
  userDetails,
  logout,
  updateUserDetails,
  searchUsers,
  getAllUsers
};
