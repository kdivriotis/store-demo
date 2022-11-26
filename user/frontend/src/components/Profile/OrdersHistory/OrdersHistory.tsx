import { FC, useContext, useState, useEffect, useCallback } from "react";
import classNames from "classnames";

import { Pagination, LoadingSpinner } from "../..";
import OrdersGrid from "./OrdersGrid/OrdersGrid";

import { AuthContext } from "../../../context";
import { AuthContextType } from "../../../interfaces/AuthContext";

import { useHttp } from "../../../hooks";

import { Order } from "../../../interfaces/Order";

import styles from "./OrdersHistory.module.css";

interface ApiResponse {
  numberOfOrders: number;
  orders: Order[];
}

const ordersPerPage = 5;

const OrderHistory: FC = () => {
  const { auth } = useContext(AuthContext) as AuthContextType;
  const { isLoading, error, sendRequest } = useHttp();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numberOfOrders, setNumberOfOrders] = useState<number>(0);
  const [orders, setOrders] = useState<Order[]>([]);

  // Get all orders from API and set state
  const getOrders = useCallback(() => {
    // transform API response
    const transformResponse = (response: ApiResponse) => {
      setNumberOfOrders(response.numberOfOrders);
      setOrders(response.orders);
    };

    // send GET request to API's route /order/:offset/:limit
    const url = `${process.env.REACT_APP_API_URL}/order/${
      (currentPage - 1) * ordersPerPage
    }/${ordersPerPage}`;
    sendRequest({ url, method: "GET", token: auth.token }, transformResponse);
  }, [setNumberOfOrders, setOrders, currentPage, auth.token, sendRequest]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  let content = (
    <div className={styles["spinner"]}>
      <LoadingSpinner />
    </div>
  );

  if (!isLoading && error && error.trim() !== "") {
    content = (
      <div className="section-padding">
        <p className="text-error">{error}</p>
      </div>
    );
  } else if (!isLoading && (!orders || orders.length === 0)) {
    content = (
      <div className="section-padding">
        <p className="text-error">Δεν υπάρχουν παραγγελίες.</p>
      </div>
    );
  } else if (!isLoading) {
    content = <OrdersGrid orders={orders} />;
  }

  return (
    <div className={classNames(styles["info_container"])}>
      {/* Header */}
      <h2 className={classNames(styles["info_title"])}>Ιστορικό Παραγγελιών</h2>
      <div className={styles["orders_pagination"]}>
        <Pagination
          itemsPerPage={ordersPerPage}
          totalItems={numberOfOrders}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
      {content}
      <div className={styles["orders_pagination"]}>
        <Pagination
          itemsPerPage={ordersPerPage}
          totalItems={numberOfOrders}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default OrderHistory;
