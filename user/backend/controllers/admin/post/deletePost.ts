import path from "path";
import fs from "fs";

import { Response } from "express";

import { Request } from "../../../interfaces/Request";

import { pool } from "../../../services/database";
import { deleteImage } from "../../../services/files";

interface DeletePostRequest {
  link: string;
}

/**
 * Administrator delete a post (news) endpoint. Expected parameters:
 * @param {string} req.body.link Post's link
 * @returns Message with info about failure or success
 */
export const deletePost = async (req: Request, res: Response) => {
  try {
    const { link } = req.body as DeletePostRequest;
    /* Check whether all required parameters are given and valid */
    // Link
    if (!link || link.trim() === "") {
      return res.status(400).json({ message: "Μη έγκυρα δεδομένα" });
    }
    await pool.query("DELETE FROM post WHERE link=?", [link]);

    const filePath = path.join(process.cwd(), "public", "uploads", "post");
    await deleteImage("post", link);

    return res.status(200).send({
      message: "Το νέο διαγράφηκε επιτυχώς.",
    });
  } catch (error: any) {
    // On database failure, return
    return res.status(500).json({
      message: `Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.\n
${error.toString()}`,
    });
  }
};
