import path from "path";
import fs from "fs";

import { Response } from "express";

import { Request } from "../../../interfaces/Request";

import { pool } from "../../../services/database";
import { deleteImage } from "../../../services/files";

interface UrlParameters {
  id: string;
}

/**
 * Administrator delete a partner endpoint. Expected parameters:
 * @param {string} req.params.id The unique ID of the partner to be deleted
 * @returns Message with info about failure or success
 */
export const deletePartner = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params as unknown as UrlParameters;
    /* Check whether all required parameters are given and valid */
    // ID
    if (!id || id.trim() === "") {
      return res.status(400).json({ message: "Μη έγκυρα δεδομένα" });
    }
    await pool.query("DELETE FROM partner WHERE BIN_TO_UUID(id)=?", [id]);

    // check & delete saved image if any
    let filePath = path.join(process.cwd(), "public", "uploads", "partner");
    let partnerImage = await deleteImage("partner", id);

    // check & delete saved pending image if any
    filePath = path.join(filePath, "pending");
    await deleteImage(path.join("partner", "pending"), id);

    return res.status(200).send({
      message: "Ο συνεργάτης διαγράφηκε επιτυχώς.",
    });
  } catch (error: any) {
    // On database failure, return
    return res.status(500).json({
      message: `Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.\n
${error.toString()}`,
    });
  }
};
