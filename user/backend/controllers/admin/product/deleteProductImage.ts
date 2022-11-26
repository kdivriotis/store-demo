import path from "path";

import { Response } from "express";

import { Request } from "../../../interfaces/Request";

import { deleteImage } from "../../../services/files";

interface UrlParameters {
  id: string;
}

interface DeleteImageParameters {
  name: string;
}

/**
 * Administrator delete a product's image endpoint. Expected parameters:
 * @param {string} req.params.id The unique ID of the product to delete its image
 * @param {string} req.body.name The name of the image to be deleted
 * @returns Message with info about failure or success
 */
export const deleteProductImage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params as unknown as UrlParameters;
    const { name } = req.body as DeleteImageParameters;
    /* Check whether all required parameters are given and valid */
    // ID & image name
    if (!id || id.trim() === "" || !name || name.trim() === "") {
      return res.status(400).json({ message: "Μη έγκυρα δεδομένα" });
    }

    // check & delete saved pending image if any
    await deleteImage(path.join("product", id), name);

    return res.status(200).send({
      message: "Η εικόνα διαγράφηκε επιτυχώς.",
    });
  } catch (error: any) {
    // On database failure, return
    return res.status(500).json({
      message: `Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.\n
${error.toString()}`,
    });
  }
};
