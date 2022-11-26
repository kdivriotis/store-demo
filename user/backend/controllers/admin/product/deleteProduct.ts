import { Response } from "express";

import { Request } from "../../../interfaces/Request";

import { pool } from "../../../services/database";
import { deleteDirectory } from "../../../services/files";

interface UrlParameters {
  id: string;
}

/**
 * Administrator permanently delete a product endpoint. Expected parameters:
 * @param {string} req.params.id The unique ID of the product to be deleted
 * @returns Message with info about failure or success
 */
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params as unknown as UrlParameters;
    /* Check whether all required parameters are given and valid */
    // ID
    if (!id || id.trim() === "" || isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Μη έγκυρα δεδομένα" });
    }
    await pool.query("DELETE FROM product WHERE id=?", [parseInt(id)]);
    await deleteDirectory("product", `${id}`);

    return res.status(200).send({
      message: "Το προϊόν διαγράφηκε οριστικά.",
    });
  } catch (error: any) {
    // On database failure, return
    return res.status(500).json({
      message: `Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.\n
${error.toString()}`,
    });
  }
};
