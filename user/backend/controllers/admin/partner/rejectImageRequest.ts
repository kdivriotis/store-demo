import path from "path";

import { Response } from "express";

import { Request } from "../../../interfaces/Request";

import { deleteImage } from "../../../services/files";

interface UrlParameters {
  id: string;
}

/**
 * Admin reject partner's image change request endpoint. Expected parameters:
 * @param {string} req.params.id The unique ID of the partner that made the request
 * @returns Message with info about failure or success
 */
export const rejectImageRequest = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params as unknown as UrlParameters;

  if (!id || id.trim() === "") {
    return res.status(400).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }

  await deleteImage(path.join("partner", "pending"), id);

  return res.status(200).json({
    message: "Το αίτημα αλλαγής εικόνας του συνεργάτη απορρίφθηκε.",
  });
};
