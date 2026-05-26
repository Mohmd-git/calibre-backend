import express from "express";
import upload from "../middleware/multerMiddleware.js";

import {
  createMaterial,
  getMaterials,
  updateMaterial,
  deleteMaterial
} from "../controllers/materialController.js";

const router = express.Router();

// ✅ MULTER WORKING
router.post("/", upload.array("files", 5), createMaterial);

router.get("/", getMaterials);
router.put("/:id", upload.array("files", 5), updateMaterial);
router.delete("/:id", deleteMaterial);

export default router;