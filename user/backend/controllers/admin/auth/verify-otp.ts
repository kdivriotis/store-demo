import { Response } from "express";

import { Request } from "../../../interfaces/Request";
import { AdminTokenPayload } from "../../../interfaces/AdminTokenPayload";

import { otpExpiresIn, otpMaxRetries } from "../../../constants";
import { expiresIn } from "../../../config/auth";

import { pool } from "../../../services/database";
import { verifyValue, generateAdminAccessToken } from "../../../services/auth";

interface OtpRequest {
  id: string;
  username: string;
  email: string;
  password: string;
  otp: string;
}

interface AdministratorResponse {
  password: string;
  otp: string;
  elapsedSeconds: number;
  retries: number;
}

/**
 * Administrator login OTP endpoint. Expected body parameters:
 * @param {string} req.body.id ID of the administrator to login
 * @param {string} req.body.username Username of the administrator to login
 * @param {string} req.body.email Email of the administrator to login
 * @param {string} req.body.password Password of the administrator to login
 * @param {string} req.body.otp One-time-password
 * @returns Message in case of failure, or { token, expiresIn } in case of successful login
 */
export const verifyOtp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // check whether all required parameters are given
  const loginData: OtpRequest = req.body as OtpRequest;
  if (
    !loginData?.username ||
    !loginData?.email ||
    !loginData?.password ||
    !loginData?.id ||
    !loginData?.otp ||
    loginData.otp.trim().length !== 6
  ) {
    return res.status(401).json({
      message: "Λανθασμένες παράμετροι, προσπαθήστε ξανά.",
    });
  }

  try {
    // get admin's info from database, for given username, email and ID
    const getInfo = await pool.query(
      "SELECT password, otp, TIMESTAMPDIFF(SECOND, otp_date, CURRENT_TIMESTAMP) AS elapsedSeconds, otp_retries AS retries FROM admin WHERE BIN_TO_UUID(id)=? AND username=? AND email=? AND otp IS NOT NULL",
      [loginData.id, loginData.username, loginData.email]
    );
    const info = getInfo[0] as AdministratorResponse[];
    if (!info || info.length === 0) {
      return res
        .status(401)
        .json({ message: "Λανθασμένες παράμετροι, προσπαθήστε ξανά." });
    }

    // check if given password is valid
    const passwordIsCorrect = await verifyValue(
      loginData.password,
      info[0].password
    );
    if (!passwordIsCorrect) {
      return res.status(401).json({
        message: "Λανθασμένες παράμετροι, προσπαθήστε ξανά.",
      });
    }

    // OTP has expired
    if (
      info[0].elapsedSeconds > otpExpiresIn * 60 ||
      info[0].elapsedSeconds < 0
    ) {
      await pool.query("UPDATE admin SET otp=NULL WHERE BIN_TO_UUID(id)=?", [
        loginData.id,
      ]);
      return res.status(401).json({
        message:
          "Ο κωδικός μίας χρήσης έχει λήξει, προσπαθήστε να συνδεθείτε ξανά.",
      });
    }

    // OTP in incorrect
    if (info[0].otp !== loginData.otp) {
      // Maximum retries limit has been reached
      if (info[0].retries + 1 >= otpMaxRetries) {
        await pool.query("UPDATE admin SET otp=NULL WHERE BIN_TO_UUID(id)=?", [
          loginData.id,
        ]);
        return res.status(401).json({
          message:
            "Υπερβήκατε το μέγιστο αριθμό προσπαθειών, προσπαθήστε να συνδεθείτε ξανά.",
        });
      }

      // Increase the retries number and send failure message
      await pool.query(
        "UPDATE admin SET otp_retries=? WHERE BIN_TO_UUID(id)=?",
        [info[0].retries + 1, loginData.id]
      );
      return res.status(401).json({
        message: `Λανθασμένος κωδικός μίας χρήσης, ελέγξτε ότι εισάγατε σωστά τον κωδικό και προσπαθήστε ξανά.\n
Απομένουν ${otpMaxRetries - info[0].retries - 1} προσπάθειες.`,
      });
    }

    // successful verification - clean the OTP & return JSON web token
    await pool.query("UPDATE admin SET otp=NULL WHERE BIN_TO_UUID(id)=?", [
      loginData.id,
    ]);

    const tokenPayload: AdminTokenPayload = {
      id: loginData.id,
      username: loginData.username,
      email: loginData.email,
    };
    const token = generateAdminAccessToken(tokenPayload);

    return res.status(200).json({
      token,
      expiresIn,
    });
  } catch (error) {
    // On database failure, return
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
