import { Router } from "express";

import { authenticateAdminToken } from "../../middleware";

import {
  getOrders,
  getOrderDetails,
  getStatistics,
  changeOrderStatus,
} from "../../controllers/admin/order";

const router: Router = Router();

router.get("/details/:orderId", authenticateAdminToken, getOrderDetails);
router.get(
  "/statistics/:year/:month?/:day?",
  authenticateAdminToken,
  getStatistics
);
router.get("/:offset/:limit/:status", authenticateAdminToken, getOrders);

router.patch(
  "/change-status/:orderId",
  authenticateAdminToken,
  changeOrderStatus
);

export default router;
