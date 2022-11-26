import path from "path";

import { Response } from "express";

import { Request } from "../../../interfaces/Request";

import { pool } from "../../../services/database";
import { getAllImages, checkImage } from "../../../services/files";

const baseUrl = process.env.BASE_URL;

interface PartnerResponse {
  id: string;
  storeName: string;
}

interface Partner {
  id: string;
  storeName: string;
  imageUrl: string | undefined | null;
  pendingImageUrl: string;
}

/**
 * Get all partners who have made requests to change their store's image.
 * @returns Message in case of failure, or { requests: Partner[] } in case of success
 */
export const getImageRequests = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const imageRequests = await getAllImages(path.join("partner", "pending"));
    if (!imageRequests || imageRequests.length === 0)
      return res
        .status(400)
        .json({ message: "Δεν υπάρχουν αιτήματα αλλαγής εικόνας" });

    const partnerIds = imageRequests.map((image) => path.parse(image).name);

    // get partners that made image requests from database, for given ID
    const getPartners = await pool.query(
      "SELECT BIN_TO_UUID(id) AS id, store_name AS storeName FROM partner WHERE BIN_TO_UUID(id) IN (?)",
      [partnerIds]
    );

    const partnersResponse = getPartners[0] as PartnerResponse[];
    const partners: Partner[] = [];

    for (let partner of partnersResponse) {
      const pendingImageName = imageRequests.find(
        (image) => path.parse(image).name === partner.id
      );
      if (!pendingImageName) continue;

      const imageName = await checkImage("partner", partner.id);

      partners.push({
        ...partner,
        imageUrl: imageName ? `${baseUrl}/uploads/partner/${imageName}` : null,
        pendingImageUrl: `${baseUrl}/uploads/partner/pending/${pendingImageName}`,
      });
    }

    return res.status(200).json({ requests: partners });
  } catch (error) {
    // On database failure, return
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
