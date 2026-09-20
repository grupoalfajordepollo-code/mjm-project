import { Router } from "express";
import { login } from "../controllers/index.js";
import { loginRateLimit } from "../middlewares/loginRateLimit.js";

const router = Router();

router.post("/login", loginRateLimit, login);

export default router;