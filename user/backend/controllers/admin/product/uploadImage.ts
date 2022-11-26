import path from "path";

import { Response } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

import { Request } from "../../../interfaces/Request";

interface UrlParameters {
  id: string;
}

/**
 * Partner upload store picture endpoint. Expected parameters:
 * @param {string} req.params.id The unique ID of the product to delete its image
 * @param {string} req.files.productImages Product's image(s) to be uploaded (handled by multer)
 * @returns Message with info about failure or success
 */
export const uploadImage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params as unknown as UrlParameters;
  /* Check whether all required parameters are given and valid */
  // ID
  if (!id || id.trim() === "") {
    return res.status(400).json({ message: "Μη έγκυρα δεδομένα" });
  }

  // Define path and file name for multer disk storage
  const productStorage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
      cb(
        null,
        path.join(process.cwd(), "public", "uploads", "product", `${id}`)
      );
    },
    filename: (req: Request, file, cb) => {
      cb(
        null,
        `${uuidv4()}${path.extname(file.originalname.toLocaleLowerCase())}`
      );
    },
  });

  const productUploadStorage = multer({
    storage: productStorage,
    limits: {
      fileSize: 2 * 1024 * 1024, // 2 MB
    },
    fileFilter: (req, file, cb) => {
      const imageNamePattern = /^.+\.(png|jpeg|jpg)$/;
      const imageTypePattern = /^image\/(png|jpeg|jpg)$/;
      if (
        imageNamePattern.test(file.originalname.toLocaleLowerCase()) &&
        imageTypePattern.test(file.mimetype)
      ) {
        cb(null, true);
      } else {
        return cb(new Error("Επιλέξτε μόνο εικόνες τύπου .jpg, .jpeg ή .png"));
      }
    },
  });

  let uploadError = "";
  const uploadMultipleImages = productUploadStorage.array("productImages", 5);
  uploadMultipleImages(req, res, (err) => {
    if (err) {
      uploadError = err.message;
    }
  });

  if (!uploadError || uploadError.trim() === "")
    return res.status(200).send({
      message: "Οι εικόνες ανέβηκαν επιτυχώς.",
    });

  return res.status(400).send({ message: uploadError });
};
