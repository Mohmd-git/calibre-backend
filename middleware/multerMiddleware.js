import dotenv from "dotenv";
dotenv.config(); // ⭐ MUST BE FIRST

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

// 🔥 DIRECT CONFIG (NO FILE IMPORT)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "calibre/general";

    if (req.baseUrl.includes("results")) {
      folder = "calibre/results";
    } else if (req.baseUrl.includes("materials")) {
      folder = "calibre/materials";
    }

    const isPDF = file.mimetype === "application/pdf"; // ⭐ KEY FIX

    return {
      folder,
      resource_type: isPDF ? "raw" : "image", // ⭐ KEY FIX
      public_id: Date.now() + "-" + file.originalname,
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only Images & PDFs allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;