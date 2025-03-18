import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./config/connectDB.js";
import userRouter from "./routes/userRoute.js";
import { app, server } from "./socket/socketServer.js";

//config
// const app = express()
const PORT = process.env.PORT || 4000;
connectDB();

//middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: ["https://chatappbymd.vercel.app"], // Allowed Frontend URLs (Array form)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Allow credentials (cookies, headers, etc.)
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed Headers
}));


//api endpoint
app.use("/api/user", userRouter);

//route
app.get("/", (req, res) => {
  res.json({ message: "Hello from backend" });
});

server.listen(PORT, () => {
  console.log("Server started");
});
