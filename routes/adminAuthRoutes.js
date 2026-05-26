import express from "express";
import { sendMagicLink, verifyToken } from "../controllers/adminAuthController.js";

const router = express.Router();

router.post("/send-magic-link", sendMagicLink);
router.post("/verify-token", verifyToken);

export default router;