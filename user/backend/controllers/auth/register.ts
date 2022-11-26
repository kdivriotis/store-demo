import { Response } from "express";

import { Request } from "../../interfaces/Request";

import {
  partnerNameLength,
  partnerStoreNameLength,
  partnerVatLength,
  partnerDoyLength,
  partnerEmailLength,
  partnerPhoneLength,
  partnerSiteUrlLength,
} from "../../constants";

import { pool } from "../../services/database";
import { hashValue } from "../../services/auth";
import { sendEmail } from "../../services/email";
import {
  validateEmail,
  validatePassword,
  validateDigitText,
  validateText,
} from "../../services/input";

const frontendUrl = process.env.FRONTEND_URL;

interface RegisterRequest {
  name: string;
  surname: string;
  storeName: string;
  vat: string;
  doy: string;
  email: string;
  phone: string;
  siteUrl?: string;
  password: string;
}

interface EmailExistsResponse {
  numberOfPartners: number;
}

/**
 * Partner register endpoint. Expected body parameters:
 * @param {string} req.body.name Owner's Name
 * @param {string} req.body.surname Owner's Surname
 * @param {string} req.body.storeName Store's Name
 * @param {string} req.body.vat VAT number (AFM) (9 digits)
 * @param {string} req.body.doy Store's DOY (Dimosia Oikonomiki Ypiresia)
 * @param {string} req.body.email Contact Email address
 * @param {string} req.body.phone Contact Phone Number
 * @param {string?} req.body.siteUrl Partner's website URL
 * @param {string} req.body.password Password
 * @returns Message with info about registration's failure or success
 */
export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const registrationData: RegisterRequest = req.body as RegisterRequest;
  /* Check whether all required parameters are given and valid */
  // Owner's Name
  let isInvalid = validateText(registrationData.name, partnerNameLength);
  if (isInvalid) {
    return res.status(400).json({ message: `Όνομα: ${isInvalid}` });
  }
  // Owner's Surname
  isInvalid = validateText(registrationData.surname, partnerNameLength);
  if (isInvalid) {
    return res.status(400).json({ message: `Επώνυμο: ${isInvalid}` });
  }
  // Store's Name
  isInvalid = validateText(registrationData.storeName, partnerStoreNameLength);
  if (isInvalid) {
    return res
      .status(400)
      .json({ message: `Όνομα Καταστήματος: ${isInvalid}` });
  }
  // VAT number (AFM) (9 digits)
  isInvalid = validateDigitText(registrationData.vat, partnerVatLength);
  if (isInvalid) {
    return res.status(400).json({ message: `ΑΦΜ: ${isInvalid}` });
  }
  // Store's DOY (Dimosia Oikonomiki Ypiresia)
  isInvalid = validateText(registrationData.doy, partnerDoyLength);
  if (isInvalid) {
    return res.status(400).json({ message: `Δ.Ο.Υ.: ${isInvalid}` });
  }
  // Contact Email address
  isInvalid = validateEmail(registrationData.email, partnerEmailLength);
  if (isInvalid) {
    return res.status(400).json({ message: `Διεύθυνση Email: ${isInvalid}` });
  }
  // Contact Phone Number
  isInvalid = validateDigitText(registrationData.phone, partnerPhoneLength);
  if (isInvalid) {
    return res
      .status(400)
      .json({ message: `Τηλέφωνο Επικοινωνίας: ${isInvalid}` });
  }
  // Partner's website URL
  if (registrationData.siteUrl && registrationData.siteUrl.trim() !== "") {
    isInvalid = validateText(registrationData.siteUrl, partnerSiteUrlLength);
    if (isInvalid) {
      return res
        .status(400)
        .json({ message: `Ιστότοπος Καταστήματος: ${isInvalid}` });
    }
  }

  // Password
  isInvalid = validatePassword(registrationData.password);
  if (isInvalid) {
    return res.status(400).json({ message: isInvalid });
  }

  try {
    // check if given email address already exists
    const emailExistsResponse = await pool.query(
      "SELECT COUNT(*) as numberOfPartners FROM partner WHERE email=? OR vat=?",
      [registrationData.email, registrationData.vat]
    );
    const emailExists = emailExistsResponse[0] as EmailExistsResponse[];
    if (emailExists[0].numberOfPartners > 0) {
      return res.status(400).json({
        message:
          "Η διεύθυνση email ή το ΑΦΜ χρησιμοποιείται ήδη. Δοκιμάστε να συνδεθείτε στο λογαριασμό σας",
      });
    }

    // Create hashed password for database & hash code for email verification
    const hashedPassword = await hashValue(registrationData.password);
    const hashedVerificationCode = require("crypto")
      .randomBytes(16)
      .toString("hex");

    // Construct the query string & parameters and execute query to DB
    let queryString, queryParameters;
    if (registrationData.siteUrl) {
      queryString =
        "INSERT INTO partner (name, surname, store_name, vat, doy, email, phone, site_url, password, hash) VALUES (?,?,?,?,?,?,?,?,?,?)";
      queryParameters = [
        registrationData.name,
        registrationData.surname,
        registrationData.storeName,
        registrationData.vat,
        registrationData.doy,
        registrationData.email,
        registrationData.phone,
        registrationData.siteUrl,
        hashedPassword,
        hashedVerificationCode,
      ];
    } else {
      queryString =
        "INSERT INTO partner (name, surname, store_name, vat, doy, email, phone, password, hash) VALUES (?,?,?,?,?,?,?,?,?)";
      queryParameters = [
        registrationData.name,
        registrationData.surname,
        registrationData.storeName,
        registrationData.vat,
        registrationData.doy,
        registrationData.email,
        registrationData.phone,
        hashedPassword,
        hashedVerificationCode,
      ];
    }

    const result = await pool.query(queryString, queryParameters);

    // Construct & send the verification email
    const verificationUrl = `${frontendUrl}/verify-email/${registrationData.vat}/${hashedVerificationCode}`;
    const subject = "Store Demo - Επιβεβαίωση διεύθυνσης email";
    const body = `<h3 style="text-align:center;">Store Demo - Ευχαριστούμε για την εγγραφή</h3>
<p>Ο λογαριασμός σας έχει δημιουργηθεί με επιτυχία. Μπορείτε να συνδεθείτε στο λογαριασμό σας αφού πρώτα επιβεβαιώσετε το email σας, πατώντας στον παρακάτω σύνδεσμο:</p>
<a href="${verificationUrl}">Επιβεβαίωση λογαριασμού</a>
<br />
<p style="font-style:italic;">Εάν λάβατε αυτό το email χωρίς να έχετε δημιουργήσει λογαριασμό, κάποιος χρήστης χρησιμοποίησε τη διεύθυνσή σας καταλάθος. Παρακαλούμε επικοινωνήστε μαζί μας για να διαγράψουμε το λογαριασμό.</p>`;
    const emailIsSent = await sendEmail(
      registrationData.email,
      subject,
      undefined,
      body
    );

    return res.status(200).json({
      message:
        "Ο λογαριασμός σας δημιουργήθηκε με επιτυχία. Επιβεβαιώστε τη διεύθυνσή σας ακολουθώντας το σύνδεσμο στο email που έχει σταλθεί στη διεύθυνση που δηλώσατε. Αν δεν έχετε λάβει κάποιο email, ελέγξτε το φάκελο με τα Ανεπιθήμητα Μηνύματα (Spam) και τη διεύθυνση που δηλώσατε, ή επικοινωνήστε μαζί μας.",
    });
  } catch (error) {
    // On database failure, return
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
