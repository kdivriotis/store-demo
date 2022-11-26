import path from "path";

import { Response } from "express";

import { Request } from "../../interfaces/Request";

import { pool } from "../../services/database";
import { getAllImages } from "../../services/files";

const baseUrl = process.env.BASE_URL;

interface ProductResponse {
  id: number;
  name: string;
  description: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  imageUrls: string[] | undefined | null;
}

/**
 * Get all products and their images (if any):
 * @returns Message in case of failure, or { products: Product[] } in case of success
 */
export const getInfo = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, name, description FROM product WHERE is_deleted=0 ORDER BY appearance_order ASC`
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
