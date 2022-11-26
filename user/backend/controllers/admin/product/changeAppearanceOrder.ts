import { Response } from "express";
import { PoolConnection } from "mysql2/promise";

import { Request } from "../../../interfaces/Request";

import { pool } from "../../../services/database";

interface Product {
  id: number;
  appearanceOrder: number;
}

interface ChangeAppearanceOrderRequest {
  products: Product[];
}

/**
 * Admin change products' aooerance order endpoint. Expected body parameters:
 * @param {Product[]} req.body.products All products and their new appearance order
 * @returns Message with info about failure or success
 */
export const changeAppearanceOrder = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { products } = req.body as ChangeAppearanceOrderRequest;

  /* Check whether all required parameters are given and valid */
  if (!products || products.length === 0) {
    return res
      .status(400)
      .json({ message: "Δεν υπάρχουν προϊόντα, προσπαθήστε ξανά." });
  }

  let connection: PoolConnection | null = null;
  try {
    // Start MySQL Transaction
    connection = await pool.getConnection();

    // Update all items in database
    for (let product of products) {
      await connection.query(
        `UPDATE product 
        SET appearance_order = ?
        WHERE id = ?`,
        [product.appearanceOrder, product.id]
      );
    }

    // commit the queries
    await connection.commit();
    await connection.release();

    return res.status(200).send({
      message: "Τα προϊόντα ενημερώθηκαν επιτυχώς.",
    });
  } catch (error: any) {
    // On failure, rollback the changes and return error message
    if (connection) {
      await connection.rollback();
      await connection.release();
    }
    return res.status(500).json({
      message: `Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.\n
  ${error.toString()}`,
    });
  }
};
