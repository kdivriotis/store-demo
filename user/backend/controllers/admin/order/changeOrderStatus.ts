import { Response } from "express";

import { Request } from "../../../interfaces/Request";

import { pool } from "../../../services/database";

enum OrderStatus {
  Pending = 0,
  InProgress = 1,
  Confirmed = 2,
  Canceled = 3,
  Rejected = 4,
}

interface UrlParameters {
  orderId: string;
}

interface ChangeOrderStatusRequest {
  status: OrderStatus;
}

/**
 * Admin change partner's details endpoint - at least one attribute has to be provided inside the request's body. Expected body parameters:
 * @param {string} req.params.orderId The unique ID of the order
 * @param {OrderStatus} req.body.status The new status of the order
 * @returns Message with info about failure or success
 */
export const changeOrderStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { orderId } = req.params as unknown as UrlParameters;

  if (!orderId || orderId.trim() === "") {
    return res.status(400).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }

  const { status } = req.body as ChangeOrderStatusRequest;

  if (
    !status ||
    status > OrderStatus.Rejected ||
    status < OrderStatus.InProgress
  ) {
    return res.status(400).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }

  try {
    await pool.query(
      `UPDATE partner_order SET status = ? WHERE BIN_TO_UUID(id) = ?`,
      [status, orderId]
    );

    return res.status(200).json({
      message: "Η κατάσταση της παραγγελίας άλλαξε επιτυχώς.",
    });
  } catch (error) {
    // On database failure, return
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
