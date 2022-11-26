import { Response } from "express";

import { Request } from "../../../interfaces/Request";

import { pool } from "../../../services/database";

interface UrlParameters {
  id: string;
}

/**
 * Admin verify partner endpoint. Expected parameters:
 * @param {string} req.params.id The unique ID of the partner to be verified
 * @returns Message with info about failure or success
 */
export const verifyPartner = async (
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
    await pool.query(
      `UPDATE partner SET is_verified=1, email_verified=1 WHERE BIN_TO_UUID(id)=?`,
      [id]
    );

    return res.status(200).json({
      message: "Το προφίλ του συνεργάτη επιβεβαιώθηκε επιτυχώς.",
    });
  } catch (error) {
    // On database failure, return
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
