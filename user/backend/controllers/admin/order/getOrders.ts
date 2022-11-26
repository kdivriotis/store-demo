import { Response } from "express";

import { Request } from "../../../interfaces/Request";

import { pool } from "../../../services/database";

interface OrderCountResponse {
  numberOfOrders: number;
}

enum OrderStatus {
  Pending = 0,
  InProgress = 1,
  Confirmed = 2,
  Canceled = 3,
  Rejected = 4,
}

interface OrderResponse {
  id: string;
  orderDate: string;
  status: OrderStatus;
  transactionDate: string;
  totalPrice: number;
  comment: string | null;
}

interface UrlParameters {
  offset: string;
  limit: string;
  status: string;
}

/**
 * Get orders based on status (with pagination):
 * @param {string} req.params.offset The offset of orders for query (used for pagination)
 * @param {string} req.params.limit The limit of orders for query (used for pagination)
 * @param {string} req.params.status The status of the order
 * @returns Message in case of failure, or { numberOforders, orders: OrderResponse[] } in case of success
 */
export const getOrders = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { offset, limit, status } = req.params as unknown as UrlParameters;

  if (
    !offset ||
    isNaN(parseInt(offset)) ||
    !limit ||
    isNaN(parseInt(limit)) ||
    !status ||
    isNaN(parseInt(status))
  ) {
    return res.status(400).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }

  try {
    const countResult = await pool.query(
      "SELECT COUNT(*) AS numberOfOrders FROM partner_order WHERE status = ?",
      [parseInt(status)]
    );

    const totalOrders = countResult[0] as OrderCountResponse[];
    if (totalOrders.length === 0) {
      return res.status(200).json({
        numberOfOrders: 0,
        orders: [],
      });
    }
    const numberOfOrders: number = totalOrders[0].numberOfOrders;

    const result = await pool.query(
      `SELECT BIN_TO_UUID(id) AS id, order_date AS orderDate, status, transaction_date AS transactionDate, total AS totalPrice, order_comment AS comment
      FROM partner_order
      WHERE status = ?
      ORDER BY order_date DESC
      LIMIT ?, ?`,
      [parseInt(status), parseInt(offset), parseInt(limit)]
    );

    const ordersResponse = result[0] as OrderResponse[];

    return res.status(200).json({
      numberOfOrders,
      orders: ordersResponse,
    });
  } catch (error) {
    // On database failure, return
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
