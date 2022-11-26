import { FC, useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import classNames from "classnames";

import { Order, OrderItem } from "../../../interfaces/Order";
import { LoadingSpinner } from "../..";
import { useHttp } from "../../../hooks";

import { AuthContext } from "../../../context";
import { AuthContextType } from "../../../interfaces/AuthContext";

import OrderHeader from "./OrderHeader/OrderHeader";
import OrderItemsList from "./OrderItemsList/OrderItemsList";

import styles from "./OrderDetails.module.css";

interface ApiResponse {
  info: Order;
  items: OrderItem[];
}

const OrderDetails: FC = () => {
  const { auth } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();
  const params = useParams();
  const { orderId } = params;
  const { isLoading, error, sendRequest } = useHttp();

  const [info, setInfo] = useState<Order | null>(null);
  const [details, setDetails] = useState<OrderItem[] | null>(null);

  if (!orderId || orderId.trim() === "")
    navigate("/profile/orders", { replace: true });

  // Get order's details from API and set state
  const getOrderDetails = () => {
    // transform API response
    const transformResponse = (response: ApiResponse) => {
      setInfo(response.info);
      setDetails(response.items);
    };

    // send GET request to API's route /order/details/:orderId
    const url = `${process.env.REACT_APP_API_URL}/order/details/${orderId}`;
    sendRequest({ url, method: "GET", token: auth.token }, transformResponse);
  };

  useEffect(() => {
    getOrderDetails();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className={styles["spinner"]}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error && error.trim() !== "") {
    return (
      <div className="section-padding" style={{ textAlign: "center" }}>
        <p className="text-error">{error}</p>
      </div>
    );
  }

  if (!details || !info) {
    return (
      <div className="section-padding" style={{ textAlign: "center" }}>
        <p className="text-error">Δεν υπάρχουν πληροφορίες.</p>
      </div>
    );
  }

  return (
    <article className={classNames("section-padding", styles["order-card"])}>
      <Link to="/profile/orders" className={styles["order-card_back"]}>
        <BsArrowLeft />
      </Link>
      <OrderHeader order={info} />
      <OrderItemsList items={details} />
    </article>
  );
};

export default OrderDetails;
