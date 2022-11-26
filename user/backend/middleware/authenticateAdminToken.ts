import { Response, NextFunction } from "express";
import { verify, decode } from "jsonwebtoken";

import { Request } from "../interfaces/Request";

import { pool } from "../services/database";

interface AdministratorResponse {
  adminExists: number;
}

interface DecodedToken {
  id: string;
  username: string;
  email: string;
  iat: number;
  exp: number;
}

/**
 * Middleware function to authenticate an administrator, getting the admin's access token from the Authorization header
 * Authorization: "Bearer <token>"
 *
 * If authentication is successful, continue to endpoint (next)
 * Otherwise send error status (401 - Not authorized)
 */
const authenticateAdminToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1]; // Header should be: Bearer xxxxx (token)
  const secret = process.env.ADMIN_JWT_SECRET || "";

  if (!token) {
    return res.status(401).json({
      message: "Μη εγκεκριμένη πρόσβαση. Συνδεθείτε και προσπαθήστε ξανά.",
    });
  }

  try {
    let isJWTValid = false;

    verify(token, secret, (error, _) => {
      if (!error) {
        isJWTValid = true;
      }
    });

    if (!isJWTValid) {
      return res.status(401).json({
        message:
          "Μη εγκεκριμένη πρόσβαση. Ανανεώστε τη σελίδα ή προσπαθήστε να αποσυνδεθείτε και να συνδεθείτε ξανά στο λογαριασμό σας.",
      });
    }

    const decodedToken = decode(token) as DecodedToken;
    req.admin = {
      id: decodedToken.id,
      username: decodedToken.username,
      email: decodedToken.email,
    };

    // Check if given admin data is valid on DB
    const result = await pool.query(
      "SELECT COUNT(*) AS adminExists FROM admin WHERE BIN_TO_UUID(id)=? AND username=? AND email=?",
      [decodedToken.id, decodedToken.username, decodedToken.email]
    );

    const info = result[0] as AdministratorResponse[];
    if (!info || info.length === 0 || info[0].adminExists < 1) {
      return res.status(401).json({
        message:
          "Μη εγκεκριμένη πρόσβαση. Ανανεώστε τη σελίδα ή προσπαθήστε να αποσυνδεθείτε και να συνδεθείτε ξανά στο λογαριασμό σας.",
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      message:
        "Μη εγκεκριμένη πρόσβαση. Ανανεώστε τη σελίδα ή προσπαθήστε να αποσυνδεθείτε και να συνδεθείτε ξανά στο λογαριασμό σας.",
    });
  }
};

export { authenticateAdminToken };
