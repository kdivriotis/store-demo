import { Router } from "express";

import { authenticateAdminToken } from "../../middleware";

import {
  getDetails,
  deletePartner,
  changePartner,
  getBrief,
  verifyPartner,
  getLinkRequests,
  acceptUrlRequest,
  rejectUrlRequest,
  getImageRequests,
  acceptImageRequest,
  rejectImageRequest,
} from "../../controllers/admin/partner";

const router: Router = Router();

router.get("/details/:id", authenticateAdminToken, getDetails);
router.get(
  "/brief/:offset/:limit/:isVerified?",
  authenticateAdminToken,
  getBrief
);
router.get("/link-requests", authenticateAdminToken, getLinkRequests);
router.get("/image-requests", authenticateAdminToken, getImageRequests);

router.patch("/change/:id", authenticateAdminToken, changePartner);
router.patch("/verify/:id", authenticateAdminToken, verifyPartner);
router.patch(
  "/link-requests/accept/:id",
  authenticateAdminToken,
  acceptUrlRequest
);
router.patch(
  "/link-requests/reject/:id",
  authenticateAdminToken,
  rejectUrlRequest
);
router.patch(
  "/image-requests/accept/:id",
  authenticateAdminToken,
  acceptImageRequest
);
router.patch(
  "/image-requests/reject/:id",
  authenticateAdminToken,
  rejectImageRequest
);

router.delete("/delete/:id", authenticateAdminToken, deletePartner);

export default router;
