import path from "path";

import { Response } from "express";
import multer from "multer";

import { Request } from "../../interfaces/Request";

/**
 * Partner upload store picture endpoint. Expected parameters:
 * @param {TokenPayload} req.user The user that made the request (automatic field from authentication middleware)
 * @param {string} req.files.storeImage Store's image to be uploaded (handled by multer)
 * @returns Message with info about failure or success
 */
export const uploadImage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.user || !req.user.id || !req.user.email || !req.user.storeName) {
    return res.status(401).json({
      message:
        "Μη εγκεκριμένη πρόσβαση. Ανανεώστε τη σελίδα ή προσπαθήστε να αποσυνδεθείτε και να συνδεθείτε ξανά στο λογαριασμό σας.",
    });
  }

  // Define path and file name for multer disk storage
  const partnerStorage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
      cb(
        null,
        path.join(process.cwd(), "public", "uploads", "partner", "pending")
      );
    },
    filename: (req: Request, file, cb) => {
      cb(
        null,
        `${req.user?.id}${path.extname(file.originalname.toLocaleLowerCase())}`
      );
    },
  });

  const partnerUploadStorage = multer({
    storage: partnerStorage,
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
  const uploadSingleImage = partnerUploadStorage.single("storeImage");
  uploadSingleImage(req, res, (err) => {
    if (err) {
      uploadError = err.message;
    }
  });

  if (!uploadError || uploadError.trim() === "")
    return res.status(200).send({
      message:
        "Το αίτημά σας για αλλαγή της εικόνας του καταστήματος ολοκληρώθηκε επιτυχώς.",
    });

  return res.status(400).send({ message: uploadError });
};
