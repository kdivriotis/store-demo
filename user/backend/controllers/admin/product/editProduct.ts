import path from "path";
import fs from "fs";

import { Response } from "express";

import { Request } from "../../../interfaces/Request";

import {
  productNameLength,
  productShortDescriptionLength,
  productDescriptionLength,
} from "../../../constants";

import { pool } from "../../../services/database";
import { validateText, validateFloat } from "../../../services/input";

interface EditProductRequest {
  name: string;
  description: string;
  shortDescription: string;
  price: string;
}

interface UrlParameters {
  id: string;
}

/**
 * Administrator edit a product endpoint. Expected files parameters:
 * @param {string} req.params.id Product's unique ID
 * @param {string} req.body.name Product's name
 * @param {string} req.body.description Product's description
 * @param {string?} req.body.shortDescription Product's short description
 * @param {string} req.body.price Product's price
 * @returns Message with info about failure or success
 */
export const editProduct = async (req: Request, res: Response) => {
  const { id } = req.params as unknown as UrlParameters;

  if (!id || id.trim() === "") {
    return res.status(400).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }

  const productData = req.body as EditProductRequest;
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
      "UPDATE product SET name=?, description=?, short_description=?, price=? WHERE id=?",
      [
        productData.name,
        productData.description,
        productData.shortDescription,
        parseFloat(productData.price),
        id,
      ]
    );

    return res.status(200).send({
      message: "Οι αλλαγές αποθηκεύτηκαν επιτυχώς.",
    });
  } catch (error: any) {
    // On database failure, return
    return res.status(500).json({
      message: `Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.\n
${error.toString()}`,
    });
  }
};
