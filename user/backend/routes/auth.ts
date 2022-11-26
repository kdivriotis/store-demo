import { Router } from "express";

import { verifyGoogleRecaptchaToken } from "../middleware";

import {
  login,
  register,
  verifyEmail,
  sendOtp,
  verifyOtp,
} from "../controllers/auth";

const router: Router = Router();

router.post("/login", verifyGoogleRecaptchaToken, login);
router.post("/register", verifyGoogleRecaptchaToken, register);
router.post("/verify", verifyGoogleRecaptchaToken, verifyEmail);
router.post("/send-otp", verifyGoogleRecaptchaToken, sendOtp);
router.post("/verify-otp", verifyGoogleRecaptchaToken, verifyOtp);

export default router;
