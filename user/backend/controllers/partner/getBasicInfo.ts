import { Response } from "express";

import { Request } from "../../interfaces/Request";
import { TokenPayload } from "../../interfaces/TokenPayload";

import { expiresIn } from "../../config/auth";

import { pool } from "../../services/database";
import { generateAccessToken } from "../../services/auth";

interface PartnerResponse {
  name: string;
  storeName: string;
  emailVerified: number;
  isVerified: number;
}

/**
 * Get basic info for the partner that made the request & refresh the token.
 * @param {TokenPayload} req.user The user that made the request (automatic field from authentication middleware)
 * @returns Message in case of failure, or { token, expiresIn, email, name, storeName, emailVerified, isVerified } in case of success
 */
export const getBasicInfo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.user || !req.user.id || !req.user.email || !req.user.storeName) {
    return res.status(401).json({
      message:
        "Μη εγκεκριμένη πρόσβαση. Ανανεώστε τη σελίδα ή προσπαθήστε να αποσυνδεθείτε και να συνδεθείτε ξανά στο λογαριασμό σας.",
    });
  }

  const { id, email, storeName } = req.user;
  try {
    // get partner's info from database, for given email
    const getInfo = await pool.query(
      "SELECT name, store_name AS storeName, email_verified AS emailVerified, is_verified AS isVerified FROM partner WHERE email=? AND BIN_TO_UUID(id)=?",
      [email, id]
    );

    const info = getInfo[0] as PartnerResponse[];
    if (!info || info.length === 0) {
      return res.status(401).json({
        message:
          "Μη εγκεκριμένη πρόσβαση. Ανανεώστε τη σελίδα ή προσπαθήστε να αποσυνδεθείτε και να συνδεθείτε ξανά στο λογαριασμό σας.",
      });
    }

    const tokenPayload: TokenPayload = {
      id,
      email,
      storeName: info[0].storeName,
    };
    const token = generateAccessToken(tokenPayload);

    return res.status(200).json({
      token,
      expiresIn,
      email,
      name: info[0].name,
      storeName: info[0].storeName,
      emailVerified: info[0].emailVerified > 0,
      isVerified: info[0].isVerified > 0,
    });
  } catch (error) {
    // On database failure, return
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
