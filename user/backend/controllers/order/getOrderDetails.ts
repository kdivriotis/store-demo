import { Response } from "express";

import { Request } from "../../interfaces/Request";

import { pool } from "../../services/database";

enum OrderStatus {
  Pending = 0,
  InProgress = 1,
  Confirmed = 2,
  Canceled = 3,
  Rejected = 4,
}

interface OrderResponse {
  orderDate: string;
  status: OrderStatus;
  transactionDate: string;
  totalPrice: number;
  comment: string | null;
}

interface OrderItem {
  quantity: number;
  price: number;
  productName: string | null;
}

interface UrlParameters {
  orderId: string;
}

/**
 * Get all details of an orders from partner:
 * @param {TokenPayload} req.user The user that made the request (automatic field from authentication middleware)
 * @param {number} req.params.orderId The unique ID of the order to get details for
 * @returns Message in case of failure, or { info: OrderResponse, items: OrderItem[] } in case of success
 */
export const getOrderDetails = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.user || !req.user.id || !req.user.email || !req.user.storeName) {
    return res.status(401).json({
      message:
        "Μη εγκεκριμένη πρόσβαση. Ανανεώστε τη σελίδα ή προσπαθήστε να αποσυνδεθείτε και να συνδεθείτε ξανά στο λογαριασμό σας.",
    });
  }

  const { orderId } = req.params as unknown as UrlParameters;

  if (!orderId) {
    return res.status(400).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }

  try {
    // Get details for the requested order
    const orderResult = await pool.query(
      `SELECT order_date AS orderDate, status, transaction_date AS transactionDate, total AS totalPrice, order_comment AS comment
      FROM partner_order
      WHERE BIN_TO_UUID(id) = ? AND BIN_TO_UUID(partner_id) = ?`,
      [orderId, req.user.id]
    );

    const orderResponse = orderResult[0] as OrderResponse[];
    if (!orderResponse || orderResponse.length === 0) {
      return res.status(400).json({
        message: "Δε βρέθηκαν δεδομένα για την παραγγελία, προσπαθήστε ξανά.",
      });
    }
    const info = orderResponse[0];

    // Get all items included in the requested order
    const itemsResult = await pool.query(
      `SELECT pod.quantity AS quantity, pod.price AS price, p.name AS productName 
      FROM partner_order_details AS pod
      JOIN product AS p
      ON pod.product_id = p.id
      WHERE BIN_TO_UUID(pod.order_id) = ?`,
      [orderId]
    );

    const itemsResponse = itemsResult[0] as OrderItem[];
    if (!itemsResponse || itemsResponse.length === 0) {
      return res.status(400).json({
        message: "Δε βρέθηκαν δεδομένα για την παραγγελία, προσπαθήστε ξανά.",
      });
    }

    return res.status(200).json({
      info: {
        id: orderId,
        ...info,
      },
      items: itemsResponse,
    });
  } catch (error) {
    // On database failure, return
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
