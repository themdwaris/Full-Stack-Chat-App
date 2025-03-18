import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import "dotenv/config"
import connectDB from "./config/connectDB.js"
import userRouter from "./routes/userRoute.js"
import { app,server } from "./socket/socketServer.js"

//config
// const app = express()
const PORT = process.env.PORT || 4000
connectDB()

//middleware
app.use(express.json())
app.use(cors({origin:process.env.FRONTEND_URL,credentials:true}))
app.use(cookieParser())

//api endpoint 
app.use("/api/user",userRouter)

//route
app.get("/",(req,res)=>{
    res.json({message:"Hello from backend"})
})



server.listen(PORT,()=>{
    console.log("Server started");
})



