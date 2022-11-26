import { Response } from "express";
import { PoolConnection } from "mysql2/promise";

import { Request } from "../../interfaces/Request";

import { pool } from "../../services/database";
import { sendEmail } from "../../services/email";
import { numberToString, round } from "../../services/utils";

interface OrderResponse {
  orderDate: string;
  totalPrice: number;
}

interface OrderItem {
  quantity: number;
  price: number;
  productName: string | null;
}

interface CartProduct {
  id: number;
  quantity: number;
}

interface NewOrderRequest {
  cart: CartProduct[];
}

interface PartnerResponse {
  isVerified: number;
}

interface InsertedOrderResponse {
  orderId: string;
}

/**
 * Partner place new order endpoint. Expected body parameters:
 * @param {TokenPayload} req.user The user that made the request (automatic field from authentication middleware)
 * @param {CartProduct[]} req.body.cart Ordered items
 * @returns Message in case of failure, or { orderId } in case of success
 */
export const newOrder = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.user || !req.user.id || !req.user.email || !req.user.storeName) {
    return res.status(401).json({
      message:
        "Μη εγκεκριμένη πρόσβαση. Ανανεώστε τη σελίδα ή προσπαθήστε να αποσυνδεθείτε και να συνδεθείτε ξανά στο λογαριασμό σας.",
    });
  }

  const { cart } = req.body as NewOrderRequest;
  /* Check whether all required parameters are given and valid */
  if (!cart || cart.length === 0) {
    return res.status(400).json({
      message: "Προσθέστε προϊόντα στο καλάθι σας και προσπαθήστε ξανά.",
    });
  }

  let connection: PoolConnection | null = null;
  try {
    // check if the partner is verified
    const partnerIsVerifiedResult = await pool.query(
      "SELECT is_verified AS isVerified FROM partner WHERE BIN_TO_UUID(id)=?",
      [req.user.id]
    );
    const isVerifiedResponse = partnerIsVerifiedResult[0] as PartnerResponse[];
    if (!isVerifiedResponse || isVerifiedResponse.length === 0) {
      return res.status(401).json({
        message:
          "Μη εγκεκριμένη πρόσβαση. Ανανεώστε τη σελίδα ή προσπαθήστε να αποσυνδεθείτε και να συνδεθείτε ξανά στο λογαριασμό σας.",
      });
    } else if (isVerifiedResponse[0].isVerified < 1) {
      return res.status(401).json({
        message:
          "Μη εγκεκριμένη πρόσβαση. Ο λογαριασμός δεν έχει εγκριθεί για πρόσβαση σε αυτή τη σελίδα.",
      });
    }

    // Start MySQL Transaction
    connection = await pool.getConnection();

    await connection.query(
      "INSERT INTO partner_order (total, status, partner_id) VALUES (0.1, 0, UUID_TO_BIN(?))",
      [req.user.id]
    );

    // Get the inserted order's ID
    const insertedOrderResult = await connection.query(
      "SELECT BIN_TO_UUID(id) AS orderId FROM partner_order WHERE BIN_TO_UUID(partner_id)=? ORDER BY order_date DESC LIMIT 1",
      [req.user.id]
    );
    const insertedOrderResponse =
      insertedOrderResult[0] as InsertedOrderResponse[];
    if (!insertedOrderResponse || insertedOrderResponse.length === 0) {
      return res.status(401).json({
        message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
      });
    }

    const insertedOrderId = insertedOrderResponse[0].orderId;

    // Insert all related items to database
    for (let item of cart) {
      await connection.query(
        `INSERT INTO partner_order_details
        (quantity, product_id, order_id, price) VALUES
        (?, ?, UUID_TO_BIN(?), (SELECT p.price FROM product AS p WHERE p.id=?))`,
        [item.quantity, item.id, insertedOrderId, item.id]
      );
    }

    await connection.query(
      `UPDATE partner_order
      SET total = (
        SELECT SUM(pod.quantity * pod.price)
        FROM partner_order_details AS pod
        WHERE BIN_TO_UUID(pod.order_id)=?
      )
      WHERE BIN_TO_UUID(id)=?`,
      [insertedOrderId, insertedOrderId]
    );

    // commit the queries
    await connection.commit();
    await connection.release();

    // Get details for the requested order
    const orderInfoResult = await pool.query(
      `SELECT order_date AS orderDate, total AS totalPrice
        FROM partner_order
        WHERE BIN_TO_UUID(id) = ?`,
      [insertedOrderId]
    );

    const orderInfoResponse = orderInfoResult[0] as OrderResponse[];
    if (!orderInfoResponse || orderInfoResponse.length === 0) {
      return res.status(200).json({
        orderId: insertedOrderId,
      });
    }

    const info = orderInfoResponse[0];

    // Get all items included in the requested order
    const itemsResult = await pool.query(
      `SELECT pod.quantity AS quantity, pod.price AS price, p.name AS productName 
      FROM partner_order_details AS pod
      JOIN product AS p
      ON pod.product_id = p.id
      WHERE BIN_TO_UUID(pod.order_id) = ?`,
      [insertedOrderId]
    );

    const itemsResponse = itemsResult[0] as OrderItem[];
    if (!itemsResponse || itemsResponse.length === 0) {
      return res.status(200).json({
        orderId: insertedOrderId,
      });
    }

    // Construct & send the verification email
    const subject = `Store Demo - Παραγγελία ${insertedOrderId}`;
    const body = `<h3 style="text-align:center;">Ευχαριστούμε για την παράγγελια σας</h3>
<p>Η παραγγελία σας έχει καταχωρηθεί επιτυχώς στο κατάστημά μας, θα ενημερωθείτε εκ νέου μέσω e-mail ή τηλεφωνικά για την εξέλιξή της.</p>
<br />
<h2>Στοιχεία Παραγγελίας</h2>
<p><strong>Μοναδικό Αναγνωριστικό:</strong> ${insertedOrderId}</p>
<p><strong>Ημερομηνία Παραγγελίας:</strong> ${new Date(
      info.orderDate
    ).toLocaleString()}</p>
<p><strong>Συνολικό Ποσό:</strong> ${info.totalPrice} €</p>
<hr style="height:2px; margin:8px 0; color:gray; background-color:gray;" />
<h3>Προϊόντα:</h3>
<ul style="margin:0; list-style-type:none; padding:0;">
${itemsResponse
  .map(
    (item) =>
      `<li style="padding:8px 0; margin:0; border-bottom:2px solid gray;">
<h4>${item.quantity} x ${item.productName}</h4>
<p><strong>Τιμή:</strong> ${numberToString(
        round(item.quantity * +item.price, 2),
        2
      )} €</p>
<p><strong>Τιμή Μονάδας:</strong> ${numberToString(item.price, 2)} €</p>
</li>`
  )
  .join("")}
</ul>
<br />
<p><em>Για οποιαδήποτε βοήθεια ή διευκρίνιση, παρακαλούμε επικοινωνήστε μαζί μας τηλεφωνικά στο ${
      process.env.COMMUNICATION_PHONE
    } ή μέσω e-mail στη διεύθυνση ${process.env.COMMUNICATION_EMAIL}.</em></p>`;
    const emailIsSent = await sendEmail(
      req.user.email,
      subject,
      undefined,
      body
    );

    return res.status(200).json({
      orderId: insertedOrderId,
    });
  } catch (error) {
    // On failure, rollback the changes and return error message
    if (connection) {
      await connection.rollback();
      await connection.release();
    }
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
