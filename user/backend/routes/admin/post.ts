import { Router } from "express";

import { authenticateAdminToken } from "../../middleware";

import { createPost, deletePost, editPost } from "../../controllers/admin/post";

const router: Router = Router();

router.post("/create", authenticateAdminToken, createPost);
router.post("/delete", authenticateAdminToken, deletePost);

router.patch("/edit/:link", authenticateAdminToken, editPost);

export default router;
