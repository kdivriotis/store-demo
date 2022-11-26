import path from "path";

import { Response } from "express";

import { Request } from "../../../interfaces/Request";

import { pool } from "../../../services/database";
import { getAllImages } from "../../../services/files";

const baseUrl = process.env.BASE_URL;

interface ProductResponse {
  id: number;
  appearanceOrder: number;
  name: string;
  shortDescription: string;
  price: number;
}

interface Product {
  id: number;
  appearanceOrder: number;
  name: string;
  shortDescription: string;
  price: number;
  image: string | undefined | null;
}

/**
 * Get brief info for all non-deleted products.
 * @returns Message in case of failure, or { products: Product[] } in case of success
 */
export const getBrief = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // get products' info from database
    const getProducts = await pool.query(
      `SELECT id, appearance_order AS appearanceOrder, name, short_description AS shortDescription, price
      FROM product
      WHERE is_deleted=0
      ORDER BY appearance_order ASC`
    );

    const productsResponse = getProducts[0] as ProductResponse[];
    let products: Product[] = [];
    for (let product of productsResponse) {
      const images = await getAllImages(path.join("product", `${product.id}`));
      products.push({
        ...product,
        image:
          images && images.length > 0
            ? `${baseUrl}/uploads/product/${product.id}/${images[0]}`
            : null,
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
