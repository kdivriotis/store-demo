import { Response } from "express";

import { Request } from "../../../interfaces/Request";

import { pool } from "../../../services/database";

interface UrlParameters {
  id: string;
}

/**
 * Admin verify partner's URL change request endpoint. Expected parameters:
 * @param {string} req.params.id The unique ID of the partner that made the request
 * @returns Message with info about failure or success
 */
export const acceptUrlRequest = async (
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
      `UPDATE partner SET site_url_is_verified=1 WHERE BIN_TO_UUID(id)=?`,
      [id]
    );

    return res.status(200).json({
      message: "Ο σύνδεσμος ιστοτόπου του συνεργάτη επιβεβαιώθηκε.",
    });
  } catch (error) {
    // On database failure, return
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
