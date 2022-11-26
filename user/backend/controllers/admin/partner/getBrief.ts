import { Response } from "express";

import { Request } from "../../../interfaces/Request";

import { pool } from "../../../services/database";
import { checkImage } from "../../../services/files";

const baseUrl = process.env.BASE_URL;

interface PartnerCountResponse {
  numberOfPartners: number;
}

interface PartnerResponse {
  id: string;
  name: string;
  surname: string;
  storeName: string;
  email: string;
  phone: string;
}

interface Partner {
  id: string;
  name: string;
  surname: string;
  storeName: string;
  email: string;
  phone: string;
  image: string | undefined | null;
}

interface UrlParameters {
  offset: string;
  limit: string;
  isVerified?: string | null;
}

/**
 * Get brief info for partners or filter by verified/not verified status.
 * @param {number} req.params.offset The offset of partners for query (used for pagination)
 * @param {number} req.params.limit The limit of partners for query (used for pagination)
 * @param {number?} req.params.isVerified If set, partners will be filtered by is_verified column (0=false, 1=true)
 * @returns Message in case of failure, or { numberOfPartners: number, partners: Partner[] } in case of success
 */
export const getBrief = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { offset, limit, isVerified } = req.params as unknown as UrlParameters;

  if (!offset || isNaN(parseInt(offset)) || !limit || isNaN(parseInt(limit))) {
    return res.status(400).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }

  let queryString: string;
  let queryParams: number[];
  let countQueryParams: number[];
  if (
    isVerified == null ||
    isNaN(parseInt(isVerified)) ||
    parseInt(isVerified) > 1 ||
    parseInt(isVerified) < 0
  ) {
    queryString = "";
    queryParams = [parseInt(offset), parseInt(limit)];
    countQueryParams = [];
  } else {
    queryString = "WHERE is_verified=?";
    queryParams = [parseInt(isVerified), parseInt(offset), parseInt(limit)];
    countQueryParams = [parseInt(isVerified)];
  }

  try {
    const countResult = await pool.query(
      `SELECT COUNT(*) AS numberOfPartners FROM partner ${queryString}`,
      countQueryParams
    );
    const totalPartners = countResult[0] as PartnerCountResponse[];
    if (totalPartners.length === 0) {
      return res.status(200).json({
        numberOfPartners: 0,
        partners: [],
      });
    }
    const numberOfPartners: number = totalPartners[0].numberOfPartners;

    // get partners' info from database, for given email & ID
    const getPartners = await pool.query(
      `SELECT BIN_TO_UUID(id) AS id, name, surname, store_name AS storeName, email, phone
      FROM partner
      ${queryString}
      LIMIT ?, ?`,
      queryParams
    );

    const partnersResponse = getPartners[0] as PartnerResponse[];
    let partners: Partner[] = [];
    for (let partner of partnersResponse) {
      const imageName = await checkImage("partner", partner.id);
      partners.push({
        ...partner,
        image: imageName ? `${baseUrl}/uploads/partner/${imageName}` : null,
      });
    }

    return res.status(200).json({ numberOfPartners, partners });
  } catch (error) {
    // On database failure, return
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
