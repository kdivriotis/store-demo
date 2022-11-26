import { Response } from "express";

import { Request } from "../../../interfaces/Request";

import { pool } from "../../../services/database";
import { hashValue, verifyValue } from "../../../services/auth";
import { sendEmail } from "../../../services/email";

import { otpExpiresIn } from "../../../constants";

const adminEmail = process.env.ADMIN_EMAIL || "";
const adminUsername = process.env.ADMIN_USERNAME || "";
const adminPassword = process.env.ADMIN_PASSWORD || "";

interface LoginRequest {
  username: string;
  email: string;
  password: string;
}

interface AdministratorResponse {
  id: string;
  password: string;
}

/**
 * Administrator login endpoint. Expected body parameters:
 * @param {string} req.body.username Username of the administrator to login
 * @param {string} req.body.email Email of the administrator to login
 * @param {string} req.body.password Password of the administrator to login
 * @returns Message in case of failure, or { id, expiresIn } in case of successful login
 */
export const login = async (req: Request, res: Response): Promise<Response> => {
  // check whether all required parameters are given
  const loginData: LoginRequest = req.body as LoginRequest;
  if (!loginData?.username || !loginData?.email || !loginData?.password) {
    return res.status(400).json({
      message: "Λανθασμένες παράμετροι, προσπαθήστε ξανά.",
    });
  }

  try {
    // Create the default administrator (if doesn't exist)
    const hashedPassword = await hashValue(adminPassword);
    await pool.query(
      "INSERT IGNORE INTO admin (username, email, password) VALUES (?, ?, ?)",
      [adminUsername, adminEmail, hashedPassword]
    );

    // get admin's info from database, for given username & email
    const getInfo = await pool.query(
      "SELECT BIN_TO_UUID(id) as id, password FROM admin WHERE username=? AND email=?",
      [loginData.username, loginData.email]
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

    const oneTimePassword = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await pool.query(
      "UPDATE admin SET otp=?, otp_date=CURRENT_TIMESTAMP, otp_retries=0 WHERE BIN_TO_UUID(id)=?",
      [oneTimePassword, info[0].id]
    );

    // Construct & send the verification email
    const subject = "Store Demo - Κωδικός Μίας Χρήσης";
    const body = `<h3 style="text-align:center;">Συνδεθείτε στο λογαριασμό σας</h3>
<p>Χρησιμοποιήστε τον παρακάτω κωδικό μίας χρήσης (OTP) για να συνδεθείτε στο λογαριασμό σας:</p>
<h4 style="text-align:center;">${oneTimePassword}</h4>
<br />
<p style="font-style:italic;">Ο κωδικός λήγει σε ${otpExpiresIn} λεπτά.</p>
<br />
<p style="font-style:italic;">Εάν δεν προσπαθήσατε να συνδεθείτε στο λογαριασμό σας, ίσως τα δεδομένα σας να είναι εκτεθειμένα. Συνδεθείτε στο λογαριασμό σας και αλλάξτε τον κωδικό πρόσβασής σας για να αποφύγετε κακόβουλες ενέργειες από τρίτους.</p>`;
    const emailIsSent = await sendEmail(
      loginData.email,
      subject,
      undefined,
      body
    );

    return res.status(200).json({
      id: info[0].id,
      expiresIn: otpExpiresIn,
    });
  } catch (error) {
    // On database failure, return
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
