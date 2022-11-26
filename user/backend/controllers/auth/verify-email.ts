import { Response } from "express";

import { Request } from "../../interfaces/Request";

import { pool } from "../../services/database";
import { sendEmail } from "../../services/email";

const adminEmail = process.env.ADMIN_EMAIL || "";

interface VerifyEmailRequest {
  vat: string;
  hash: string;
}

interface StoreInfoResponse {
  name: string;
  surname: string;
  email: string;
  phone: string;
  storeName: string;
  emailVerified: number;
  isVerified: number;
  hash: string;
}

interface UpdateResponse {
  affectedRows?: number;
}

/**
 * Partner login endpoint. Expected body parameters:
 * @param {string} req.body.vat VAT number of the partner whose email address is being verified
 * @param {string} req.body.hash Hash code to be used for verification
 * @returns Message with info about verification's failure or success
 */
export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // check whether all required parameters are given
  const verifyData: VerifyEmailRequest = req.body as VerifyEmailRequest;
  if (!verifyData?.vat || !verifyData?.hash) {
    return res.status(400).json({
      message:
        "Λανθασμένες παράμετροι, προσπαθήστε ξανά ακολουθώντας το σύνδεσμο που εστάλη στη διεύθυνση e-mail σας ή επικοινωνήστε μαζί μας αν χρειάζεστε βοήθεια.",
    });
  }

  try {
    // get partner's info from database, for given email
    const getInfo = await pool.query(
      "SELECT name, surname, store_name AS storeName, email, phone, email_verified AS emailVerified, is_verified AS isVerified, hash FROM partner WHERE vat=?",
      [verifyData.vat]
    );
    const info = getInfo[0] as StoreInfoResponse[];
    if (!info || info.length === 0) {
      return res.status(400).json({
        message:
          "Λανθασμένες παράμετροι, προσπαθήστε ξανά ακολουθώντας το σύνδεσμο που εστάλη στη διεύθυνση e-mail σας ή επικοινωνήστε μαζί μας αν χρειάζεστε βοήθεια.",
      });
    }

    // check if email is already verified
    if (info[0].emailVerified > 0) {
      return res.status(200).json({
        message: "Η διεύθυνση e-mail σας είναι ήδη επιβεβαιωμένη.",
      });
    }

    // check if provided hash value is correct
    if (info[0].hash !== verifyData.hash) {
      return res.status(400).json({
        message:
          "Λανθασμένες παράμετροι, προσπαθήστε ξανά ακολουθώντας το σύνδεσμο που εστάλη στη διεύθυνση e-mail σας ή επικοινωνήστε μαζί μας αν χρειάζεστε βοήθεια.",
      });
    }

    const updateResult = await pool.query(
      "UPDATE partner SET email_verified=1 WHERE vat=?",
      [verifyData.vat]
    );
    const verifyUserResult = updateResult[0] as UpdateResponse;

    if (!verifyUserResult.affectedRows || verifyUserResult.affectedRows < 1) {
      return res.status(500).json({
        message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
      });
    }

    if (!info[0].isVerified) {
      // Construct & send the verification email
      const subject = `Έγκριση καταστήματος ${info[0].storeName}`;
      const body = `<h3 style="text-align:center;">Αναμένεται Έγκριση</h3>
<p>Ο χρήστης ${info[0].name} ${info[0].surname} έχει επιβεβαιώσει το λογαριασμό του για το κατάστημα ${info[0].storeName}. Αναμένεται έγκριση από το διαχειριστή για να δωθεί η δυνατότητα παραγγελίας από την ιστοσελίδα.</p>
<p>Στοιχεία επικοινωνίας:</p>
<p>Email: ${info[0].email}</p>
<p>Τηλέφωνο Επικοινωνίας: ${info[0].phone}</p>`;
      const emailIsSent = await sendEmail(adminEmail, subject, undefined, body);

      return res.status(200).json({
        message:
          "Ο λογαριασμός σας επιβεβαιώθηκε επιτυχώς. Αναμένεται η έγκριση από το διαχειριστή προκειμένου να μπορέσετε να πραγματοποιήσετε τις παραγγελίες σας.",
      });
    } else {
      return res.status(200).json({
        message:
          "Ο λογαριασμός σας επιβεβαιώθηκε επιτυχώς και έχει εγκριθεί. Μπορείτε πλέον να πραγματοποιήσετε τις παραγγελίες σας.",
      });
    }
  } catch (error) {
    // On database failure, return
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
