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

interface OrderResponse {
  partnerId: string;
  orderDate: string;
  status: OrderStatus;
  transactionDate: string;
  totalPrice: number;
  comment: string | null;
}

interface Order {
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

interface PartnerResponse {
  name: string;
  surname: string;
  storeName: string;
  vat: string;
  doy: string;
  email: string;
  phone: string;
}

interface UrlParameters {
  orderId: string;
}

/**
 * Get all details of an order:
 * @param {string} req.params.orderId The unique ID of the order to get details for
 * @returns Message in case of failure, or { info: Order, items: OrderItem[], partner: PartnerResponse } in case of success
 */
export const getOrderDetails = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { orderId } = req.params as unknown as UrlParameters;

  if (!orderId) {
    return res.status(400).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }

  try {
    // Get details for the requested order
    const orderResult = await pool.query(
      `SELECT BIN_TO_UUID(partner_id) AS partnerId, order_date AS orderDate, status, transaction_date AS transactionDate, total AS totalPrice, order_comment AS comment
      FROM partner_order
      WHERE BIN_TO_UUID(id) = ?`,
      [orderId]
    );

    const orderResponse = orderResult[0] as OrderResponse[];
    if (!orderResponse || orderResponse.length === 0) {
      return res.status(400).json({
        message: "Δε βρέθηκαν δεδομένα για την παραγγελία, προσπαθήστε ξανά.",
      });
    }
    const info = orderResponse[0] as Order;

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

    // Get partner's info
    const partnerId = orderResponse[0].partnerId;
    const partnerResult = await pool.query(
      `SELECT name, surname, store_name AS storeName, vat, doy, email, phone
      FROM partner
      WHERE BIN_TO_UUID(id) = ?
      LIMIT 1`,
      [partnerId]
    );

    const partnerResponse = partnerResult[0] as PartnerResponse[];
    let partner: PartnerResponse | null;
    if (!partnerResponse || partnerResponse.length === 0) partner = null;
    else partner = partnerResponse[0];

    return res.status(200).json({
      info: {
        id: orderId,
        ...info,
      },
      items: itemsResponse,
      partner,
    });
  } catch (error) {
    // On database failure, return
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
