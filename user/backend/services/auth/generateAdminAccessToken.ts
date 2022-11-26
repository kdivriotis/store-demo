import { sign } from "jsonwebtoken";

import { AdminTokenPayload } from "../../interfaces/AdminTokenPayload";

import { expiresIn } from "../../config/auth";

/**
 * Generate a JSON web token for administrator account
 * @param {AdminTokenPayload} tokenInfo
 * @returns A JSON web token for the given <tokenInfo>, signed with <adminSecret> expiring in <expiresIn> constant
 */
export const generateAdminAccessToken = (
  tokenInfo: AdminTokenPayload
): string => {
  const secret = process.env.ADMIN_JWT_SECRET || "";
  return sign(tokenInfo, secret, { expiresIn });
};
