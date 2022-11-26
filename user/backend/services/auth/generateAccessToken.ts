import { sign } from "jsonwebtoken";

import { TokenPayload } from "../../interfaces/TokenPayload";

import { expiresIn } from "../../config/auth";

/**
 * Generate a JSON web token for partner account
 * @param {TokenPayload} tokenInfo
 * @returns @returns A JSON web token for the given <tokenInfo>, signed with <secret> expiring in <expiresIn> constant
 */
export const generateAccessToken = (tokenInfo: TokenPayload): string => {
  const secret = process.env.JWT_SECRET || "";
  return sign(tokenInfo, secret, { expiresIn });
};
