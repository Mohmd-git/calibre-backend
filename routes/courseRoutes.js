import express from "express";
import multer from "multer";

import {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("image"), createCourse);
router.get("/", getCourses);
router.put("/:id", upload.single("image"), updateCourse);
router.delete("/:id", deleteCourse);

export default router;