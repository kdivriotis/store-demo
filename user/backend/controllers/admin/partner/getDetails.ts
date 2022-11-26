import { Response } from "express";

import { Request } from "../../../interfaces/Request";

import { pool } from "../../../services/database";
import { checkImage } from "../../../services/files";

const baseUrl = process.env.BASE_URL;

interface PartnerResponse {
  name: string;
  surname: string;
  storeName: string;
  vat: string;
  doy: string;
  siteUrl: string | null;
  siteUrlVerified: number;
  email: string;
  emailVerified: number;
  phone: string;
  isVerified: number;
}

interface UrlParameters {
  id: string;
}

/**
 * Get all details for the partner that made the request.
 * @param {string} req.params.id The unique ID of the partner to get info for
 * @returns Message in case of failure, or partner's profile info in case of success ({ partner})
 */
export const getDetails = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params as unknown as UrlParameters;

  if (!id || id.trim() === "") {
    return res.status(400).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }

  try {
    // get partner's info from database, for given email & ID
    const getInfo = await pool.query(
      `SELECT name, surname, store_name AS storeName, vat, doy, site_url AS siteUrl,
      site_url_is_verified AS siteUrlVerified, email, email_verified AS emailVerified, phone, is_verified AS isVerified
      FROM partner
      WHERE BIN_TO_UUID(id)=?`,
      [id]
    );

    const info = getInfo[0] as PartnerResponse[];
    if (!info || info.length === 0) {
      return res.status(401).json({
        message:
          "Δεν υπάρχει συνεργάτης με το ζητούμενο μοναδικό αναγνωριστικό, προσπαθήστε ξανά.",
      });
    }

    const imageName = await checkImage("partner", id);

    return res.status(200).json({
      partner: {
        id,
        name: info[0].name,
        surname: info[0].surname,
        storeName: info[0].storeName,
        isVerified: info[0].isVerified > 0,
        vat: info[0].vat,
        doy: info[0].doy,
        email: info[0].email,
        emailVerified: info[0].emailVerified > 0,
        phone: info[0].phone,
        siteUrl: info[0].siteUrl,
        siteUrlVerified: info[0].siteUrlVerified > 0,
        imageUrl: imageName ? `${baseUrl}/uploads/partner/${imageName}` : null,
      },
    });
  } catch (error) {
    // On database failure, return
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
