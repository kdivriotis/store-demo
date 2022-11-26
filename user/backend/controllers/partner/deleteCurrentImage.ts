import { Response } from "express";

import { Request } from "../../interfaces/Request";

import { deleteImage } from "../../services/files";

/**
 * Partner cancel image change request endpoint. Expected parameters:
 * @param {TokenPayload} req.user The user that made the request (automatic field from authentication middleware)
 * @returns Message with info about failure or success
 */
export const deleteCurrentImage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.user || !req.user.id || !req.user.email || !req.user.storeName) {
    return res.status(401).json({
      message:
        "Μη εγκεκριμένη πρόσβαση. Ανανεώστε τη σελίδα ή προσπαθήστε να αποσυνδεθείτε και να συνδεθείτε ξανά στο λογαριασμό σας.",
    });
  }

  const { id } = req.user;

  await deleteImage("partner", id);

  return res.status(200).json({
    message: "Η εικόνα του καταστήματός σας διαγράφηκε επιτυχώς.",
  });
};
