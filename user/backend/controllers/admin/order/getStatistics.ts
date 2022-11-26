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

interface OrderPartnersResponse {
  allPartners: number;
}

interface OrderSummaryResponse {
  activePartners: number;
  orders: number;
  income: number;
}

interface OrderItemsResponse {
  name: string;
  quantity: number;
}

interface OrderStatisticsResponse {
  orders: number;
  income: number;
  month?: number;
  day?: number;
  hour?: number;
}

interface Statistics {
  allPartners: number;
  activePartners: number;
  income: number;
  orders: number;
  products: OrderItemsResponse[];
  statistics: OrderStatisticsResponse[];
}

interface UrlParameters {
  year: string;
  month?: string;
  day?: string;
}

/**
 * Get orders statistics for selected dates:
 * @param {string} req.params.year The year to get statistics for
 * @param {string?} req.params.month The month to get statistics for (optional)
 * @param {string?} req.params.day The day to get statistics for (optional)
 * @returns Message in case of failure, or { partners, orders, income } in case of success
 */
export const getStatistics = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { year, month, day } = req.params as unknown as UrlParameters;

  // year parameter is required and has to be a number
  if (!year || isNaN(parseInt(year))) {
    return res.status(400).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }

  let statistics: Statistics = {
    allPartners: 0,
    activePartners: 0,
    income: 0,
    orders: 0,
    products: [],
    statistics: [],
  };

  try {
    // Get count of all partners
    const partnersResult = await pool.query(
      "SELECT COUNT(*) AS allPartners FROM partner"
    );
    const allPartnersResponse = partnersResult[0] as OrderPartnersResponse[];
    if (allPartnersResponse.length === 0) {
      return res.status(200).json({
        ...statistics,
      });
    }
    statistics.allPartners = allPartnersResponse[0].allPartners;

    // Construct the date-based query string, depending on given parameters (year, month(optional), day(optional))
    let queryStr = "WHERE po.status = ? AND YEAR(po.transaction_date) = ?";
    let queryParams = [OrderStatus.Confirmed, parseInt(year)];

    let statisticsQueryStr = `
    SELECT SUM(po.total) AS income, COUNT(po.id) AS orders, MONTH(po.transaction_date) AS month
    FROM partner_order AS po
    ${queryStr}
    GROUP BY month`;
    // check if month parameter is given and valid
    if (
      month &&
      !isNaN(parseInt(month)) &&
      parseInt(month) > 0 &&
      parseInt(month) <= 12
    ) {
      queryStr += " AND MONTH(po.transaction_date) = ?";
      queryParams.push(parseInt(month));
      statisticsQueryStr = `
      SELECT SUM(po.total) AS income, COUNT(po.id) AS orders, DAY(po.transaction_date) AS day
      FROM partner_order AS po
      ${queryStr}
      GROUP BY day`;
      // check if day parameter is given and valid
      if (
        day &&
        !isNaN(parseInt(day)) &&
        parseInt(day) > 0 &&
        parseInt(day) <= 31
      ) {
        queryStr += " AND DAY(po.transaction_date) = ?";
        queryParams.push(parseInt(day));
        statisticsQueryStr = `
        SELECT SUM(po.total) AS income, COUNT(po.id) AS orders, HOUR(po.transaction_date) AS hour
        FROM partner_order AS po
        ${queryStr}
        GROUP BY hour`;
      }
    }

    // Get orders' summary (activeUsers, income, orders)
    const orderSummaryResult = await pool.query(
      `SELECT COUNT(DISTINCT(po.partner_id)) AS activePartners, COUNT(*) AS orders, SUM(po.total) AS income
      FROM partner_order AS po
      ${queryStr}`,
      queryParams
    );
    const orderSummaryResponse =
      orderSummaryResult[0] as OrderSummaryResponse[];
    if (orderSummaryResponse.length === 0) {
      return res.status(200).json({
        ...statistics,
      });
    }
    statistics.activePartners = orderSummaryResponse[0].activePartners;
    statistics.orders = orderSummaryResponse[0].orders ?? 0;
    statistics.income = orderSummaryResponse[0].income ?? 0;

    // Get orders' frequency per product
    const orderProductsResult = await pool.query(
      `SELECT p.name AS name, SUM(pod.quantity) AS quantity
      FROM partner_order_details AS pod
      JOIN product AS p ON p.id = pod.product_id
      WHERE pod.order_id IN (
        SELECT po.id FROM partner_order AS po
        ${queryStr}
      )
      GROUP BY pod.product_id`,
      queryParams
    );
    const orderProductsResponse =
      orderProductsResult[0] as OrderItemsResponse[];
    statistics.products = orderProductsResponse;

    // Get orders' statistics per month/day/hour (depending on given parameters)
    const orderStatisticsResult = await pool.query(
      statisticsQueryStr,
      queryParams
    );
    const orderStatisticsResponse =
      orderStatisticsResult[0] as OrderStatisticsResponse[];
    statistics.statistics = orderStatisticsResponse;

    return res.status(200).json(statistics);
  } catch (error) {
    // On database failure, return
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
