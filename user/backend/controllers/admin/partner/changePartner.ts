import { Response } from "express";

import { Request } from "../../../interfaces/Request";

import {
  partnerNameLength,
  partnerStoreNameLength,
  partnerVatLength,
  partnerDoyLength,
  partnerEmailLength,
  partnerPhoneLength,
} from "../../../constants";

import { pool } from "../../../services/database";
import {
  validateEmail,
  validateDigitText,
  validateText,
  validateUrl,
} from "../../../services/input";

interface ChangePartnerRequest {
  name: string | undefined;
  surname: string | undefined;
  storeName: string | undefined;
  siteUrl: string | undefined;
  vat: string | undefined;
  doy: string | undefined;
  email: string | undefined;
  phone: string | undefined;
}

interface UrlParameters {
  id: string;
}

/**
 * Admin change partner's details endpoint - at least one attribute has to be provided inside the request's body. Expected body parameters:
 * @param {string} req.params.id The unique ID of the partner to be changed
 * @param {string | undefined} req.body.name Changed name of the partner (optional)
 * @param {string | undefined} req.body.surname Changed surname of the partner (optional)
 * @param {string | undefined} req.body.storeName Changed store name of the partner (optional)
 * @param {string | undefined} req.body.siteUrl Changed site URL of the partner (optional)
 * @param {string | undefined} req.body.vat Changed VAT of the partner (optional)
 * @param {string | undefined} req.body.doy Changed DOY of the partner (optional)
 * @param {string | undefined} req.body.email Changed email address of the partner (optional)
 * @param {string | undefined} req.body.phone Changed phone number of the partner (optional)
 * @returns Message with info about failure or success
 */
export const changePartner = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params as unknown as UrlParameters;

  if (!id || id.trim() === "") {
    return res.status(400).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }

  const { name, surname, storeName, siteUrl, vat, doy, email, phone } =
    req.body as ChangePartnerRequest;

  let isInvalid: string | null,
    updatedFields: string[] = [],
    queryParameters: string[] = [];

  // Owner's name
  if (name && name.trim() !== "") {
    isInvalid = validateText(name, partnerNameLength);
    if (isInvalid) {
      return res.status(400).json({ message: `Όνομα: ${isInvalid}` });
    }
    updatedFields.push("name=?");
    queryParameters.push(name.trim());
  }

  // Owner's surname
  if (surname && surname.trim() !== "") {
    isInvalid = validateText(surname, partnerNameLength);
    if (isInvalid) {
      return res.status(400).json({ message: `Επώνυμο: ${isInvalid}` });
    }
    updatedFields.push("surname=?");
    queryParameters.push(surname.trim());
  }

  // Store's name
  if (storeName && storeName.trim() !== "") {
    isInvalid = validateText(storeName, partnerStoreNameLength);
    if (isInvalid) {
      return res
        .status(400)
        .json({ message: `Όνομα καταστήματος: ${isInvalid}` });
    }
    updatedFields.push("store_name=?");
    queryParameters.push(storeName.trim());
  }

  // Store's website/page URL
  if (siteUrl) {
    isInvalid = siteUrl.trim() !== "" ? validateUrl(siteUrl) : null;
    if (isInvalid) {
      return res
        .status(400)
        .json({ message: `Ιστότοπος Καταστήματος: ${isInvalid}` });
    }
    updatedFields.push("site_url=?, site_url_is_verified=1");
    queryParameters.push(siteUrl.trim());
  }

  // VAT number (AFM) (9 digits)
  if (vat && vat.trim() !== "") {
    isInvalid = validateDigitText(vat, partnerVatLength);
    if (isInvalid) {
      return res.status(400).json({ message: `ΑΦΜ: ${isInvalid}` });
    }
    updatedFields.push("vat=?");
    queryParameters.push(vat.trim());
  }

  // Store's DOY (Dimosia Oikonomiki Ypiresia)
  if (doy && doy.trim() !== "") {
    isInvalid = validateText(doy, partnerDoyLength);
    if (isInvalid) {
      return res.status(400).json({ message: `Δ.Ο.Υ.: ${isInvalid}` });
    }
    updatedFields.push("doy=?");
    queryParameters.push(doy.trim());
  }

  // Contact Email address
  if (email && email.trim() !== "") {
    isInvalid = validateEmail(email, partnerEmailLength);
    if (isInvalid) {
      return res.status(400).json({ message: `Διεύθυνση Email: ${isInvalid}` });
    }
    updatedFields.push("email=?, email_verified=1");
    queryParameters.push(email.trim());
  }

  // Contact Phone Number
  if (phone && phone.trim() !== "") {
    isInvalid = validateDigitText(phone, partnerPhoneLength);
    if (isInvalid) {
      return res
        .status(400)
        .json({ message: `Τηλέφωνο Επικοινωνίας: ${isInvalid}` });
    }
    updatedFields.push("phone=?");
    queryParameters.push(phone.trim());
  }

  if (queryParameters.length === 0)
    return res.status(400).json({
      message: "Δεν έχουν οριστεί αλλαγές, προσπαθήστε ξανά",
    });

  try {
    const updateQueryString = updatedFields.join(", ");
    await pool.query(
      `UPDATE partner SET ${updateQueryString} WHERE BIN_TO_UUID(id)=?`,
      [...queryParameters, id]
    );

    return res.status(200).json({
      message: "Οι πληροφορίες του συνεργάτη άλλαξαν επιτυχώς.",
    });
  } catch (error) {
    // On database failure, return
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
