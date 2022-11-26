import { Response } from "express";

import { Request } from "../../../interfaces/Request";

import { pool } from "../../../services/database";

interface PartnerResponse {
  id: string;
  storeName: string;
  siteUrl: string;
}

/**
 * Get all partners who have made requests to change their store's URL.
 * @returns Message in case of failure, or { requests: PartnerResponse[] } in case of success
 */
export const getLinkRequests = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // get partners that made URL requests from database, for given email & ID
    const getPartners = await pool.query(
      "SELECT BIN_TO_UUID(id) AS id, store_name AS storeName, TRIM(site_url) AS siteUrl FROM partner WHERE site_url_is_verified=0 AND site_url IS NOT NULL AND TRIM(site_url) <> '';"
    );

    const partners = getPartners[0] as PartnerResponse[];

    return res.status(200).json({ requests: partners });
  } catch (error) {
    // On database failure, return
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
