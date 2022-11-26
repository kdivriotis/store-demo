import path from "path";

import { Response } from "express";

import { Request } from "../../../interfaces/Request";

import { checkImage, deleteImage, moveFile } from "../../../services/files";

interface UrlParameters {
  id: string;
}

/**
 * Admin verify partner's image change request endpoint. Expected parameters:
 * @param {string} req.params.id The unique ID of the partner that made the request
 * @returns Message with info about failure or success
 */
export const acceptImageRequest = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params as unknown as UrlParameters;

  if (!id || id.trim() === "") {
    return res.status(400).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }

  const pendingImageName = await checkImage(
    path.join("partner", "pending"),
    id
  );

  if (!pendingImageName) {
    return res.status(400).json({
      message:
        "Δεν υπάρχει αίτημα αλλαγής εικόνας, παρακαλούμε προσπαθήστε ξανά.",
    });
  }

  await deleteImage("partner", id);
  await moveFile(path.join("partner", "pending"), "partner", pendingImageName);

  return res.status(200).json({
    message: "Η εικόνα του συνεργάτη ενημερώθηκε.",
  });
};
