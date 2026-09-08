import { Router } from "express";
import { uploadImage } from "../controllers/uploadController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
const router = Router();

router.post("/", authMiddleware, adminMiddleware, uploadImage);

export default router;