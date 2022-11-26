import { FC, useMemo } from "react";
import classNames from "classnames";

import { Order, OrderStatus } from "../../../../interfaces/Order";

import styles from "./OrderHeader.module.css";

interface OrderHeaderProps {
  order: Order;
}

const OrderHeader: FC<OrderHeaderProps> = ({ order }) => {
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
    <section id="order-info" className={classNames(styles["order-header"])}>
      <h1>Στοιχεία Παραγγελίας</h1>
      <div className={classNames(styles["order-header_content"])}>
        <h3>Μοναδικό Αναγνωριστικό</h3>
        <p>{id}</p>
      </div>
      <div className={classNames(styles["order-header_content"])}>
        <h3>Ημερομηνία Παραγγελίας</h3>
        <p>{new Date(orderDate).toLocaleString()}</p>
      </div>
      <div className={classNames(styles["order-header_content"])}>
        <h3>Κατάσταση Παραγγελίας</h3>
        <p>
          {statusString} (Τελευταία ενημέρωση στις {new Date(transactionDate).toLocaleString()})
        </p>
      </div>
      <div className={classNames(styles["order-header_content"])}>
        <h3>Συνολικό Ποσό</h3>
        <p>{totalPrice} €</p>
      </div>
    </section>
  );
};

export default OrderHeader;
