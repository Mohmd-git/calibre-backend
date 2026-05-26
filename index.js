import dotenv from "dotenv";
dotenv.config(); // ⭐ MUST BE FIRST

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// 🔥 DEBUG ENV (temporary)
console.log("CLOUD NAME:", process.env.CLOUD_NAME);
console.log("API KEY:", process.env.CLOUD_API_KEY);
console.log("MONGO URI:", process.env.MONGO_URI ? "Loaded ✅" : "Missing ❌");

// IMPORT ROUTES
import courseRoutes from "./routes/courseRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js"; 
import contactRoutes from "./routes/contactRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// API ROUTES
app.use("/api/courses", courseRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/admin-auth", adminAuthRoutes); 
app.use("/api/contact", contactRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("Mongo Error ❌:", err));

// Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});