import { Router } from "express";
import { register } from "../controllers/auth.controller.js";
import { resendOtp, verifyOtp } from "../controllers/otp.controller.js";
import { logout, me } from "../controllers/session.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { registerLimiter, resendLimiter, verifyLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.post("/register", registerLimiter, register);
router.post("/verify-otp", verifyLimiter, verifyOtp);
router.post("/resend-otp", resendLimiter, resendOtp);
router.get("/me", requireAuth, me);
router.post("/logout", logout);

export default router;