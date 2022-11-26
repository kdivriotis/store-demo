import { FC } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { Order } from "../../../../interfaces/Order";

import styles from "./OrderCard.module.css";

interface OrderCardProps {
  order: Order;
}

const OrderCard: FC<OrderCardProps> = ({ order }) => {
  const { id, orderDate, status, totalPrice } = order;

  return (
    <Link to={id} className={classNames(styles["order-card"])}>
      <div className={classNames(styles["order-card_content"])}>
        <h4>Ημερομηνία Παραγγελίας: {new Date(orderDate).toLocaleString()}</h4>
        <p>Σύνολο: {totalPrice} €</p>
      </div>
      <div className={classNames(styles["order-card_link"])}>
        <p>Προβολή Λεπτομερειών &gt;&gt;</p>
      </div>
    </Link>
  );
};

export default OrderCard;
