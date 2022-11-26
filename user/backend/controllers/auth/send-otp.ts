import { Response } from "express";

import { Request } from "../../interfaces/Request";

import { pool } from "../../services/database";
import { sendEmail } from "../../services/email";

import { otpExpiresIn } from "../../constants";

interface SendOtpRequest {
  email: string;
  vat: string;
}

interface PartnerResponse {
  id: string;
}

/**
 * Partner send one-time-password endpoint (to reset password). Expected body parameters:
 * @param {string} req.body.email Partner's email address
 * @param {string} req.body.vat Partner's VAT (AFM)
 * @returns Message in case of failure, or { id, expiresIn } in case of success
 */
export const sendOtp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // check whether all required parameters are given
  const partner: SendOtpRequest = req.body as SendOtpRequest;
  if (!partner?.email || !partner?.vat) {
    return res.status(400).json({
      message: "Λανθασμένες παράμετροι, προσπαθήστε ξανά.",
    });
  }

  try {
    // get partner's info from database, for given email & VAT
    const getInfo = await pool.query(
      "SELECT BIN_TO_UUID(id) AS id FROM partner WHERE email=? AND vat=?",
      [partner.email, partner.vat]
    );
    const info = getInfo[0] as PartnerResponse[];
    if (!info || info.length === 0) {
      return res.status(400).json({
        message: "Λανθασμένη διεύθυνση e-mail ή ΑΦΜ. Προσπαθήστε ξανά",
      });
    }

    const oneTimePassword = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await pool.query(
      "UPDATE partner SET otp=?, otp_date=CURRENT_TIMESTAMP, otp_retries=0 WHERE BIN_TO_UUID(id)=?",
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
      partner.email,
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
