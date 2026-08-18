import { Router } from "express";
import { login, loginAdmin } from "../controllers/index.js";

const router = Router();

router.post("/login", login);
router.post("/login-admin", loginAdmin);

export default router;