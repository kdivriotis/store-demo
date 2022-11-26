import path from "path";

import { Response } from "express";

import { Request } from "../../interfaces/Request";

import { pool } from "../../services/database";
import { checkImage } from "../../services/files";

const baseUrl = process.env.BASE_URL;

interface PartnerResponse {
  name: string;
  surname: string;
  storeName: string;
  vat: string;
  doy: string;
  siteUrl: string | null;
  siteUrlVerified: number;
  emailVerified: number;
  phone: string;
  isVerified: number;
}

/**
 * Get all profile info for the partner that made the request.
 * @param {TokenPayload} req.user The user that made the request (automatic field from authentication middleware)
 * @returns Message in case of failure, or partner's profile info { name, surname, storeName, isVerified, vat, doy, phone, email, emailVerified, siteUrl, siteUrlVerified, imageUrl, pendingImageUrl } in case of success in case of success
 */
export const getProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.user || !req.user.id || !req.user.email || !req.user.storeName) {
    return res.status(401).json({
      message:
        "Μη εγκεκριμένη πρόσβαση. Ανανεώστε τη σελίδα ή προσπαθήστε να αποσυνδεθείτε και να συνδεθείτε ξανά στο λογαριασμό σας.",
    });
  }

  const { id, email } = req.user;
  try {
    // get partner's info from database, for given email & ID
    const getInfo = await pool.query(
      `SELECT name, surname, store_name AS storeName, vat, doy, site_url AS siteUrl,
      site_url_is_verified AS siteUrlVerified, email_verified AS emailVerified, phone, is_verified AS isVerified
      FROM partner
      WHERE email=? AND BIN_TO_UUID(id)=?`,
      [email, id]
    );

    const info = getInfo[0] as PartnerResponse[];
    if (!info || info.length === 0) {
      return res.status(401).json({
        message:
          "Μη εγκεκριμένη πρόσβαση. Ανανεώστε τη σελίδα ή προσπαθήστε να αποσυνδεθείτε και να συνδεθείτε ξανά στο λογαριασμό σας.",
      });
    }

    const imageName = await checkImage("partner", id);
    const pendingImageName = await checkImage(
      path.join("partner", "pending"),
      id
    );

    return res.status(200).json({
      name: info[0].name,
      surname: info[0].surname,
      storeName: info[0].storeName,
      isVerified: info[0].isVerified > 0,
      vat: info[0].vat,
      doy: info[0].doy,
      email,
      emailVerified: info[0].emailVerified > 0,
      phone: info[0].phone,
      siteUrl: info[0].siteUrl,
      siteUrlVerified: info[0].siteUrlVerified > 0,
      imageUrl: imageName ? `${baseUrl}/uploads/partner/${imageName}` : null,
      pendingImageUrl: pendingImageName
        ? `${baseUrl}/uploads/partner/pending/${pendingImageName}`
        : null,
    });
  } catch (error) {
    // On database failure, return
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
