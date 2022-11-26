import { Response } from "express";

import { Request } from "../../interfaces/Request";
import { TokenPayload } from "../../interfaces/TokenPayload";

import { expiresIn } from "../../config/auth";

import { pool } from "../../services/database";
import { verifyValue, generateAccessToken } from "../../services/auth";

interface LoginRequest {
  email: string;
  password: string;
}

interface PartnerResponse {
  id: string;
  name: string;
  storeName: string;
  emailVerified: number;
  isVerified: number;
  password: string;
}

/**
 * Partner login endpoint. Expected body parameters:
 * @param {string} req.body.email Email of the partner trying to login
 * @param {string} req.body.password Password of the partner trying to login
 * @returns Message in case of failure, or { token, expiresIn, email, name, storeName, emailVerified, isVerified } in case of successful login
 */
export const login = async (req: Request, res: Response): Promise<Response> => {
  // check whether all required parameters are given
  const loginData: LoginRequest = req.body as LoginRequest;
  if (!loginData?.email || !loginData?.password) {
    return res.status(400).json({
      message: "Τα πεδία e-mail και κωδικός πρόσβασης είναι υποχρεωτικά",
    });
  }

  try {
    // get partner's info from database, for given email
    const getInfo = await pool.query(
      "SELECT BIN_TO_UUID(id) as id, name, store_name AS storeName, email_verified AS emailVerified, is_verified AS isVerified, password FROM partner WHERE email=?",
      [loginData.email]
    );
    const info = getInfo[0] as PartnerResponse[];
    if (!info || info.length === 0) {
      return res
        .status(401)
        .json({ message: `Λανθασμένη διεύθυνση email. Προσπαθήστε ξανά` });
    }

    // check if given email/password is valid
    const passwordIsCorrect = await verifyValue(
      loginData.password,
      info[0].password
    );
    if (!passwordIsCorrect) {
      return res.status(401).json({
        message: "Λάθος διεύθυνση email ή κωδικός πρόσβασης. Προσπαθήστε ξανά",
      });
    }

    const tokenPayload: TokenPayload = {
      id: info[0].id,
      email: loginData.email,
      storeName: info[0].storeName,
    };
    const token = generateAccessToken(tokenPayload);

    return res.status(200).json({
      token,
      expiresIn,
      email: loginData.email,
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
