import express from "express"
import { getAllUsers, logout, searchUsers, updateUserDetails, userDetails, userRegister,verifyEmail,verifyPassword } from "../controller/userController.js"

const userRouter = express.Router()

userRouter.post("/register",userRegister)
userRouter.post("/verifyemail",verifyEmail)
userRouter.post("/verifypassword",verifyPassword)
userRouter.get("/userdetails",userDetails)
userRouter.get("/logout",logout)
userRouter.post("/update",updateUserDetails)
userRouter.post("/search",searchUsers)
userRouter.get("/allusers",getAllUsers)


export default userRouter