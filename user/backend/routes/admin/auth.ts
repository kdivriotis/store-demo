import { Router } from "express";

import {
  verifyGoogleRecaptchaToken,
  authenticateAdminToken,
} from "../../middleware";

import { login, verifyOtp, refreshToken } from "../../controllers/admin/auth";

const router: Router = Router();

router.get("/refresh-token", authenticateAdminToken, refreshToken);

router.post("/login", verifyGoogleRecaptchaToken, login);
router.post("/verify-otp", verifyGoogleRecaptchaToken, verifyOtp);

export default router;
