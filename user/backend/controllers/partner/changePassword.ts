import { Response } from "express";

import { Request } from "../../interfaces/Request";

import { pool } from "../../services/database";
import { hashValue, verifyValue } from "../../services/auth";
import { validatePassword } from "../../services/input";

interface PartnerResponse {
  password: string;
}

interface ChangePasswordRequest {
  oldPassword: string;
  password: string;
}

interface UpdateResponse {
  affectedRows?: number;
}

/**
 * Partner change password endpoint. Expected body parameters:
 * @param {TokenPayload} req.user The user that made the request (automatic field from authentication middleware)
 * @param {string} req.body.oldPassword Current(old) Password
 * @param {string} req.body.password New Password
 * @returns Message with info about failure or success
 */
export const changePassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.user || !req.user.id || !req.user.email || !req.user.storeName) {
    return res.status(401).json({
      message:
        "Μη εγκεκριμένη πρόσβαση. Ανανεώστε τη σελίδα ή προσπαθήστε να αποσυνδεθείτε και να συνδεθείτε ξανά στο λογαριασμό σας.",
    });
  }

  const changePasswordData = req.body as ChangePasswordRequest;
  /* Check whether all required parameters are given and valid */
  // Old Password
  let isInvalid = validatePassword(changePasswordData.oldPassword);
  if (isInvalid) {
    return res.status(400).json({ message: isInvalid });
  }

  // New Password
  isInvalid = validatePassword(changePasswordData.password);
  if (isInvalid) {
    return res.status(400).json({ message: isInvalid });
  }

  const { id, email } = req.user;
  try {
    // get partner's password from database, for given email and ID
    const getInfo = await pool.query(
      "SELECT password FROM partner WHERE email=? AND BIN_TO_UUID(id)=?",
      [email, id]
    );

    const info = getInfo[0] as PartnerResponse[];
    if (!info || info.length === 0) {
      return res.status(401).json({
        message:
          "Μη εγκεκριμένη πρόσβαση. Ανανεώστε τη σελίδα ή προσπαθήστε να αποσυνδεθείτε και να συνδεθείτε ξανά στο λογαριασμό σας.",
      });
    }

    // check if given email is valid
    const passwordIsCorrect = await verifyValue(
      changePasswordData.oldPassword,
      info[0].password
    );
    if (!passwordIsCorrect) {
      return res.status(401).json({
        message: "Λάθος κωδικός πρόσβασης. Προσπαθήστε ξανά",
      });
    }

    // Create hashed password for database
    const hashedPassword = await hashValue(changePasswordData.password);

    const updateResult = await pool.query(
      "UPDATE partner SET password=? WHERE email=?",
      [hashedPassword, email]
    );
    const updatePasswordResult = updateResult[0] as UpdateResponse;

    if (
      !updatePasswordResult.affectedRows ||
      updatePasswordResult.affectedRows < 1
    ) {
      return res.status(500).json({
        message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
      });
    }

    return res.status(200).json({
      message: "Ο κωδικός πρόσβασης άλλαξε επιτυχώς",
    });
  } catch (error) {
    // On database failure, return
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
