import { Router } from "express";

import { authenticateUserToken } from "../middleware";

import { getInfo, getProducts } from "../controllers/product";

const router: Router = Router();

router.get("/", getInfo);
router.get("/details", authenticateUserToken, getProducts);

export default router;
