import { Router } from "express";

import { authenticateAdminToken } from "../../middleware";

import {
  getBrief,
  getBriefDeleted,
  getDetails,
  createProduct,
  uploadImage,
  temporarilyDeleteProduct,
  editProduct,
  restoreProduct,
  changeAppearanceOrder,
  deleteProduct,
  deleteProductImage,
} from "../../controllers/admin/product";

const router: Router = Router();

router.get("/", authenticateAdminToken, getBrief);
router.get("/deleted", authenticateAdminToken, getBriefDeleted);
router.get("/details/:id", authenticateAdminToken, getDetails);

router.post("/create", authenticateAdminToken, createProduct);
router.post("/upload-image/:id", authenticateAdminToken, uploadImage);

router.patch("/edit/:id", authenticateAdminToken, editProduct);
router.patch(
  "/delete/temp/:id",
  authenticateAdminToken,
  temporarilyDeleteProduct
);
router.patch("/restore/:id", authenticateAdminToken, restoreProduct);
router.patch("/change-order", authenticateAdminToken, changeAppearanceOrder);

router.delete("/delete/:id", authenticateAdminToken, deleteProduct);
router.delete("/delete-image/:id", authenticateAdminToken, deleteProductImage);

export default router;
