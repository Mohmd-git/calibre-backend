import express from "express";
import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

import {
  createResult,
  getResults,
  updateResult,
  deleteResult
} from "../controllers/resultController.js";

// ✅ ROUTES WITH MULTER
router.post("/", upload.single("image"), createResult);
router.put("/:id", upload.single("image"), updateResult);

router.get("/", getResults);
router.delete("/:id", deleteResult);

export default router;