import path from "path";

import { Response } from "express";

import { Request } from "../../interfaces/Request";

import { pool } from "../../services/database";
import { getAllImages } from "../../services/files";

const baseUrl = process.env.BASE_URL;

interface ProductResponse {
  id: number;
  name: string;
  shortDescription: string;
  price: number;
}

interface PartnerResponse {
  isVerified: number;
}

interface Product {
  id: number;
  name: string;
  shortDescription: string;
  price: number;
  imageUrls: string[] | undefined | null;
}

/**
 * Get detailed information about all products.
 * @param {TokenPayload} req.user The user that made the request (automatic field from authentication middleware)
 * @returns Message in case of failure, or { products: Product[] } in case of success
 */
export const getProducts = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.user || !req.user.id || !req.user.email || !req.user.storeName) {
    return res.status(401).json({
      message:
        "Μη εγκεκριμένη πρόσβαση. Ανανεώστε τη σελίδα ή προσπαθήστε να αποσυνδεθείτε και να συνδεθείτε ξανά στο λογαριασμό σας.",
    });
  }

  try {
    // check if the partner is verified
    const partnerIsVerifiedResult = await pool.query(
      "SELECT is_verified AS isVerified FROM partner WHERE BIN_TO_UUID(id)=?",
      [req.user.id]
    );
    const isVerifiedResponse = partnerIsVerifiedResult[0] as PartnerResponse[];
    if (!isVerifiedResponse || isVerifiedResponse.length === 0) {
      return res.status(401).json({
        message:
          "Μη εγκεκριμένη πρόσβαση. Ανανεώστε τη σελίδα ή προσπαθήστε να αποσυνδεθείτε και να συνδεθείτε ξανά στο λογαριασμό σας.",
      });
    } else if (isVerifiedResponse[0].isVerified < 1) {
      return res.status(401).json({
        message:
          "Μη εγκεκριμένη πρόσβαση. Ο λογαριασμός δεν έχει εγκριθεί για πρόσβαση σε αυτή τη σελίδα.",
      });
    }

    // get product's info from database, for given ID
    const result = await pool.query(
      "SELECT id, name, short_description AS shortDescription, price FROM product WHERE is_deleted=0 ORDER BY appearance_order ASC"
    );

    const productsResponse = result[0] as ProductResponse[];
    const products: Product[] = [];

    for (let product of productsResponse) {
      const imageUrls = await getAllImages(
        path.join("product", `${product.id}`)
      );
      products.push({
        ...product,
        imageUrls: imageUrls?.map(
          (image) => `${baseUrl}/uploads/product/${product.id}/${image}`
        ),
      });
    }

    return res.status(200).json({ products });
  } catch (error) {
    // On database failure, return
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
