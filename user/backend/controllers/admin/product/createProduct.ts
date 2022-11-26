import { Response } from "express";

import { Request } from "../../../interfaces/Request";

import {
  productNameLength,
  productShortDescriptionLength,
  productDescriptionLength,
} from "../../../constants";

import { pool } from "../../../services/database";
import { deleteDirectory, createDirectory } from "../../../services/files";
import { validateText, validateFloat } from "../../../services/input";

interface CreateProductRequest {
  name: string;
  description: string;
  shortDescription: string;
  price: string;
}

interface InsertResponse {
  insertId: number;
}

/**
 * Administrator create a new product endpoint. Expected files parameters:
 * @param {string} req.body.name Product's name
 * @param {string} req.body.description Product's description
 * @param {string?} req.body.shortDescription Product's short description
 * @param {string} req.body.price Product's price
 * @returns Message with info about failure or success and inserted product's unique ID
 */
export const createProduct = async (req: Request, res: Response) => {
  const productData = req.body as CreateProductRequest;
  /* Check whether all required parameters are given and valid */
  // Name
  let isInvalid = validateText(productData.name, productNameLength);
  if (isInvalid) {
    return res.status(400).json({ message: `Όνομα προϊόντος: ${isInvalid}` });
  }

  // Description
  isInvalid = validateText(productData.description, productDescriptionLength);
  if (isInvalid) {
    return res.status(400).json({ message: `Εκτενής Περιγραφή: ${isInvalid}` });
  }

  // Short Description
  isInvalid = validateText(
    productData.shortDescription,
    productShortDescriptionLength
  );
  if (isInvalid) {
    return res.status(400).json({ message: `Σύντομη Περιγραφή: ${isInvalid}` });
  }

  // Price
  isInvalid = validateFloat(productData.price);
  if (isInvalid) {
    return res.status(400).json({ message: `Τιμή: ${isInvalid}` });
  }

  try {
    const result = await pool.query(
      "INSERT INTO product (name, description, short_description, price, is_deleted, appearance_order) VALUES (?,?,?,?,0,0)",
      [
        productData.name,
        productData.description,
        productData.shortDescription,
        parseFloat(productData.price),
      ]
    );

    const { insertId } = result[0] as InsertResponse;
    await deleteDirectory("product", `${insertId}`);
    await createDirectory("product", `${insertId}`);

    return res.status(200).send({
      id: insertId,
      message: "Το νέο δημιουργήθηκε επιτυχώς.",
    });
  } catch (error: any) {
    // On database failure, return
    return res.status(500).json({
      message: `Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.\n
${error.toString()}`,
    });
  }
};
