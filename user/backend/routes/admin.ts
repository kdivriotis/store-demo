import { Router } from "express";

import {
  authRouter,
  partnerRouter,
  postRouter,
  productRouter,
  orderRouter,
} from "./admin/";

const router: Router = Router();

router.use("/auth", authRouter);
router.use("/partner", partnerRouter);
router.use("/post", postRouter);
router.use("/product", productRouter);
router.use("/order", orderRouter);

export default router;
