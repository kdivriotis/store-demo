import path from "path";

import { Response } from "express";

import { Request } from "../../../interfaces/Request";

import { pool } from "../../../services/database";
import { getAllImages } from "../../../services/files";

const baseUrl = process.env.BASE_URL;

interface ProductResponse {
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  isDeleted: number;
}

interface UrlParameters {
  id: string;
}

/**
 * Get all details for a specific product.
 * @param {string} req.params.id The unique ID of the product to get info for
 * @returns Message in case of failure, or partner's profile info in case of success ({ partner})
 */
export const getDetails = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params as unknown as UrlParameters;

  if (!id || id.trim() === "") {
    return res.status(400).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }

  try {
    // get product's info from database, for given ID
    const getInfo = await pool.query(
      `SELECT name, description, short_description AS shortDescription, price, is_deleted AS isDeleted
      FROM product
      WHERE id=?`,
      [id]
    );

    const info = getInfo[0] as ProductResponse[];
    if (!info || info.length === 0) {
      return res.status(401).json({
        message:
          "Δεν υπάρχει προϊόν με το ζητούμενο μοναδικό αναγνωριστικό, προσπαθήστε ξανά.",
      });
    }

    const images = await getAllImages(path.join("product", `${id}`));

    return res.status(200).json({
      id,
      name: info[0].name,
      description: info[0].description,
      shortDescription: info[0].shortDescription,
      price: info[0].price,
      isDeleted: info[0].isDeleted > 0,
      images: images
        ? images.map((image) => `${baseUrl}/uploads/product/${id}/${image}`)
        : null,
    });
  } catch (error) {
    // On database failure, return
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
