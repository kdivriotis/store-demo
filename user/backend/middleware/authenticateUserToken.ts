import { Response, NextFunction } from "express";
import { verify, decode } from "jsonwebtoken";

import { Request } from "../interfaces/Request";

interface DecodedToken {
  id: string;
  email: string;
  storeName: string;
  iat: number;
  exp: number;
}

/**
 * Middleware function to authenticate a user, getting the user's access token from the Authorization header
 * Authorization: "Bearer <token>"
 *
 * If authentication is successful, continue to endpoint (next)
 * Otherwise send error status (401 - Not authorized)
 */
const authenticateUserToken = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1]; // Header should be: Bearer xxxxx (token)
  const secret = process.env.JWT_SECRET || "";

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
    req.user = {
      id: decodedToken.id,
      email: decodedToken.email,
      storeName: decodedToken.storeName,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      message:
        "Μη εγκεκριμένη πρόσβαση. Ανανεώστε τη σελίδα ή προσπαθήστε να αποσυνδεθείτε και να συνδεθείτε ξανά στο λογαριασμό σας.",
    });
  }
};

export { authenticateUserToken };
