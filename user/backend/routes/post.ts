import { Router } from "express";

import { getPosts, getPostDetails } from "../controllers/post";

const router: Router = Router();

router.get("/details/:link", getPostDetails);
router.get("/:offset/:limit", getPosts);

export default router;
