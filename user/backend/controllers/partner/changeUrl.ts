import { Response } from "express";

import { Request } from "../../interfaces/Request";

import { pool } from "../../services/database";
import { validateUrl } from "../../services/input";

interface ChangeStoreUrlRequest {
  storeUrl: string;
}

interface UpdateResponse {
  affectedRows?: number;
}

/**
 * Partner change store's URL endpoint. Expected body parameters:
 * @param {TokenPayload} req.user The user that made the request (automatic field from authentication middleware)
 * @param {string} req.body.storeUrl New URL of the store
 * @returns Message with info about failure or success
 */
export const changeUrl = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.user || !req.user.id || !req.user.email || !req.user.storeName) {
    return res.status(401).json({
      message:
        "Μη εγκεκριμένη πρόσβαση. Ανανεώστε τη σελίδα ή προσπαθήστε να αποσυνδεθείτε και να συνδεθείτε ξανά στο λογαριασμό σας.",
    });
  }

  const changeUrlData = req.body as ChangeStoreUrlRequest;
  /* Check whether all required parameters are given and valid */
  if (!changeUrlData.storeUrl) {
    return res
      .status(400)
      .json({ message: "Εισάγετε μία έγκυρη διεύθυνση ιστοτόπου." });
  }

  const isInvalid = validateUrl(changeUrlData.storeUrl);
  if (isInvalid) {
    return res.status(400).json({ message: isInvalid });
  }

  const { id, email } = req.user;
  try {
    const updateResult = await pool.query(
      "UPDATE partner SET site_url=?, site_url_is_verified=0 WHERE email=? AND BIN_TO_UUID(id)=?",
      [changeUrlData.storeUrl, email, id]
    );
    const updateUrlResult = updateResult[0] as UpdateResponse;

    if (!updateUrlResult.affectedRows || updateUrlResult.affectedRows < 1) {
      return res.status(500).json({
        message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
      });
    }

    return res.status(200).json({
      message:
        "Η διεύθυνση του ιστοτόπου άλλαξε επιτυχώς. Αναμένεται έγκριση από το διαχειριστή.",
    });
  } catch (error) {
    // On database failure, return
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
