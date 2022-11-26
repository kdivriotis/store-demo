import { FC, useMemo } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { Order, OrderStatus } from "../../../../interfaces/Order";

import styles from "./OrderCard.module.css";

interface OrderCardProps {
  order: Order;
}

const OrderCard: FC<OrderCardProps> = ({ order }) => {
  const { id, orderDate, status, transactionDate, totalPrice } = order;

  const statusString = useMemo(() => {
    switch (status) {
      case OrderStatus.Pending:
        return "Νέα";
      case OrderStatus.InProgress:
        return "Σε Εξέλιξη";
      case OrderStatus.Confirmed:
        return "Ολοκληρωμένη";
      case OrderStatus.Canceled:
        return "Ακυρωμένη";
      case OrderStatus.Rejected:
        return "Απορρίφθηκε";
      default:
        return "Άγνωστη";
    }
  }, [status]);

  return (
    <Link to={id} className={classNames(styles["order-card"])}>
      <div className={classNames(styles["order-card_content"])}>
        <h4>Ημερομηνία Παραγγελίας: {new Date(orderDate).toLocaleString()}</h4>
        <p>
          Κατάσταση: {statusString} (
          {new Date(transactionDate).toLocaleString()})
        </p>
        <p>Σύνολο: {totalPrice} €</p>
      </div>
    </Link>
  );
};

export default OrderCard;
