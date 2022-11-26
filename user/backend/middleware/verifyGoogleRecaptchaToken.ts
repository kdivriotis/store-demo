import { Response, NextFunction } from "express";

import axios from "axios";

import { Request } from "../interfaces/Request";

interface GoogleReCaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: Date | string;
  hostname: string;
}

/**
 * Middleware function to verify google's ReCaptcha v3 token
 *
 * If authentication is successful, continue to endpoint (next)
 * Otherwise send error status (401 - Not authorized)
 */
const verifyGoogleRecaptchaToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  if (!req.body.googleRecaptchaToken || req.body.googleRecaptchaToken === "") {
    return res.status(401).json({
      message:
        "Google ReCaptcha: Μη εγκεκριμένη πρόσβαση. Ανανεώστε τη σελίδα και προσπαθήστε ξανά",
    });
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const googleRecaptchaToken = req.body.googleRecaptchaToken;
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${googleRecaptchaToken}`;

  try {
    const response = await axios.post(verifyUrl);
    const googleResponse = response.data as GoogleReCaptchaResponse;
    if (!googleResponse.success || googleResponse.score < 0.3) {
      return res.status(401).json({
        message:
          "Google ReCaptcha: Μη εγκεκριμένη πρόσβαση. Ανανεώστε τη σελίδα και προσπαθήστε ξανά",
      });
    }
    next();
  } catch (err) {
    return res.status(401).json({
      message:
        "Google ReCaptcha: Μη εγκεκριμένη πρόσβαση. Ανανεώστε τη σελίδα και προσπαθήστε ξανά",
    });
  }
};

export { verifyGoogleRecaptchaToken };
