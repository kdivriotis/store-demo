import { Response } from "express";

import { Request } from "../../../interfaces/Request";
import { AdminTokenPayload } from "../../../interfaces/AdminTokenPayload";

import { expiresIn } from "../../../config/auth";

import { generateAdminAccessToken } from "../../../services/auth";

/**
 * Administrator refresh token
 * @param {string} req.admin The administrator data after token authentication
 * @returns Message in case of failure, or { token, expiresIn } in case of success
 */
export const refreshToken = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.admin) {
    return res.status(401).json({
      message:
        "Μη εγκεκριμένη πρόσβαση. Ανανεώστε τη σελίδα ή προσπαθήστε να αποσυνδεθείτε και να συνδεθείτε ξανά στο λογαριασμό σας.",
    });
  }

  const { id, username, email } = req.admin;

  const tokenPayload: AdminTokenPayload = {
    id,
    username,
    email,
  };
  const token = generateAdminAccessToken(tokenPayload);

  return res.status(200).json({
    token,
    expiresIn,
  });
};
