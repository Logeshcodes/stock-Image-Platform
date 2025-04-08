import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectToDatabase } from "./config";
import authRoutes from "./routes/authRoutes";
import imageRoutes from "./routes/ImageRoutes";

dotenv.config();
connectToDatabase();

const app = express();

// const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000" ;

const allowedOrigins = [
  "http://localhost:3000",
  "https://stock-image-platform-7hx3.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

// API routes
app.use('/api/auth', authRoutes);
app.use("/api/image", imageRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
