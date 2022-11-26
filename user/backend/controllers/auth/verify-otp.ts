import { Response } from "express";

import { Request } from "../../interfaces/Request";

import { otpExpiresIn, otpMaxRetries } from "../../constants";

import { pool } from "../../services/database";
import { sendEmail } from "../../services/email";
import { hashValue, generatePassword } from "../../services/auth";

interface OtpRequest {
  id: string;
  email: string;
  vat: string;
  otp: string;
}

interface PartnerResponse {
  otp: string;
  elapsedSeconds: number;
  retries: number;
}

/**
 * Partner verify OTP endpoint. Expected body parameters:
 * @param {string} req.body.id ID of the partner to verify the OTP
 * @param {string} req.body.email Email of the partner to verify the OTP
 * @param {string} req.body.vat Partner's VAT (AFM)
 * @param {string} req.body.otp One-time-password
 * @returns Message with info about verification's failure or success
 */
export const verifyOtp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // check whether all required parameters are given
  const partnerData: OtpRequest = req.body as OtpRequest;
  if (
    !partnerData?.id ||
    !partnerData?.email ||
    !partnerData?.vat ||
    !partnerData?.otp ||
    partnerData.otp.trim().length !== 6
  ) {
    return res.status(401).json({
      message: "Λανθασμένες παράμετροι, προσπαθήστε ξανά.",
    });
  }

  try {
    // get partner's info from database, for given ID and email
    const getInfo = await pool.query(
      "SELECT otp, TIMESTAMPDIFF(SECOND, otp_date, CURRENT_TIMESTAMP) AS elapsedSeconds, otp_retries AS retries FROM partner WHERE BIN_TO_UUID(id)=? AND email=? AND vat=? AND otp IS NOT NULL",
      [partnerData.id, partnerData.email, partnerData.vat]
    );
    const info = getInfo[0] as PartnerResponse[];
    if (!info || info.length === 0) {
      return res
        .status(401)
        .json({ message: "Λανθασμένες παράμετροι, προσπαθήστε ξανά." });
    }

    // OTP has expired
    if (
      info[0].elapsedSeconds > otpExpiresIn * 60 ||
      info[0].elapsedSeconds < 0
    ) {
      await pool.query("UPDATE partner SET otp=NULL WHERE BIN_TO_UUID(id)=?", [
        partnerData.id,
      ]);
      return res.status(401).json({
        message: "Ο κωδικός μίας χρήσης έχει λήξει, προσπαθήστε ξανά.",
      });
    }

    // OTP in incorrect
    if (info[0].otp !== partnerData.otp) {
      // Maximum retries limit has been reached
      if (info[0].retries + 1 >= otpMaxRetries) {
        await pool.query(
          "UPDATE partner SET otp=NULL WHERE BIN_TO_UUID(id)=?",
          [partnerData.id]
        );
        return res.status(401).json({
          message:
            "Υπερβήκατε το μέγιστο αριθμό προσπαθειών, επαναλάβετε τη διαδικασία και προσπαθήστε ξανά.",
        });
      }

      // Increase the retries number and send failure message
      await pool.query(
        "UPDATE partner SET otp_retries=? WHERE BIN_TO_UUID(id)=?",
        [info[0].retries + 1, partnerData.id]
      );
      return res.status(401).json({
        message: `Λανθασμένος κωδικός μίας χρήσης, ελέγξτε ότι εισάγατε σωστά τον κωδικό και προσπαθήστε ξανά.\n
Απομένουν ${otpMaxRetries - info[0].retries - 1} προσπάθειες.`,
      });
    }

    /* successful verification - generate new random password, clean the OTP, send email & return success message */

    // Create new random password and the hashed password for database
    const newPassword = generatePassword(16);
    const hashedPassword = await hashValue(newPassword);

    await pool.query(
      "UPDATE partner SET password=?, otp=NULL WHERE BIN_TO_UUID(id)=?",
      [hashedPassword, partnerData.id]
    );

    // Construct & send the verification email
    const subject = "Store Demo - Επαναφορά Κωδικού Πρόσβασης";
    const body = `<h3 style="text-align:center;">Νέος Κωδικός Πρόσβασης</h3>
<p>Χρησιμοποιήστε τον παρακάτω κωδικό πρόσβασης για να συνδεθείτε στο λογαριασμό σας:</p>
<h4 style="text-align:center;">${newPassword}</h4>
<br />
<p style="font-style:italic;">Ο παραπάνω κωδικός είναι ασφαλής και δημιουργήθηκε τυχαία. Αφού συνδεθείτε, μεταβείτε στο προφίλ σας προκειμένου να αλλάξετε τον κωδικό πρόσβασής σας.</p>
<br />
<p style="font-style:italic;">Εάν δεν προσπαθήσατε να συνδεθείτε στο λογαριασμό σας, ίσως τα δεδομένα σας να είναι εκτεθειμένα. Συνδεθείτε στο λογαριασμό σας και αλλάξτε τον κωδικό πρόσβασής σας για να αποφύγετε κακόβουλες ενέργειες από τρίτους.</p>`;
    const emailIsSent = await sendEmail(
      partnerData.email,
      subject,
      undefined,
      body
    );

    return res.status(200).json({
      message:
        "Μπορείτε πλέον να συνδεθείτε με τον κωδικό πρόσβασης που λάβατε στη διεύθυνση e-mail σας.",
    });
  } catch (error) {
    // On database failure, return
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
