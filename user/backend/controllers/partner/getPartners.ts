import { Response } from "express";

import { Request } from "../../interfaces/Request";

import { pool } from "../../services/database";
import { checkImage } from "../../services/files";

const baseUrl = process.env.BASE_URL;

interface PartnerResponse {
  id: string;
  storeName: string;
  siteUrl: string | null;
  siteUrlIsVerified: number;
}

interface Partner {
  storeName: string;
  siteUrl: string | null;
  image: string | undefined | null;
}

/**
 * Get brief info for all partners.
 * @returns Message in case of failure, or { partners: Partner[] } in case of success
 */
export const getPartners = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // get partners' info from database
    const getPartners = await pool.query(
      `SELECT BIN_TO_UUID(id) AS id, store_name AS storeName, site_url AS siteUrl, site_url_is_verified AS siteUrlIsVerified
      FROM partner
      WHERE is_verified = 1`
    );

    const partnersResponse = getPartners[0] as PartnerResponse[];
    let partners: Partner[] = [];
    for (let partner of partnersResponse) {
      const imageName = await checkImage("partner", partner.id);
      partners.push({
        storeName: partner.storeName,
        siteUrl: partner.siteUrlIsVerified > 0 ? partner.siteUrl : null,
        image: imageName ? `${baseUrl}/uploads/partner/${imageName}` : null,
      });
    }

    return res.status(200).json({ partners });
  } catch (error) {
    // On database failure, return
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
