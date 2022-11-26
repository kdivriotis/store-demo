import { Router } from "express";

import { authenticateUserToken } from "../middleware";

import {
  getBasicInfo,
  getProfile,
  getPartners,
  changePassword,
  uploadImage,
  changeUrl,
  cancelImageRequest,
  deleteCurrentImage,
} from "../controllers/partner";

const router: Router = Router();

router.get("/info", authenticateUserToken, getBasicInfo);
router.get("/profile", authenticateUserToken, getProfile);
router.get("/", getPartners);

router.post("/upload-image", authenticateUserToken, uploadImage);

router.patch("/change-password", authenticateUserToken, changePassword);
router.patch("/change-url", authenticateUserToken, changeUrl);

router.delete("/cancel-request", authenticateUserToken, cancelImageRequest);
router.delete("/delete-image", authenticateUserToken, deleteCurrentImage);

export default router;
