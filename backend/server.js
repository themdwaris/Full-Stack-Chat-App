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
app.use(cors({
  origin: ["https://chatappbymd.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
// app.use(cors({
//   origin: (origin, callback) => {
//       const allowedOrigins = ["https://chatappbymd.vercel.app", "http://localhost:5173"];
//       if (!origin || allowedOrigins.includes(origin)) {
//           callback(null, true);
//       } else {
//           callback(new Error("Not allowed by CORS"));
//       }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"], 
//   credentials: true,
// }));
app.use(express.json());
app.use(cookieParser());

//api endpoint
app.use("/api/user", userRouter);

//route
app.get("/", (req, res) => {
  res.json({ message: "Hello from backend" });
});

server.listen(PORT, () => {
  console.log("Server started");
});
