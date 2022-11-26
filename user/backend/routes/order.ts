import { Router } from "express";

import { authenticateUserToken } from "../middleware";

import { newOrder, getOrders, getOrderDetails } from "../controllers/order";

const router: Router = Router();

router.get("/details/:orderId", authenticateUserToken, getOrderDetails);
router.get("/:offset/:limit", authenticateUserToken, getOrders);

router.post("/new", authenticateUserToken, newOrder);

export default router;
