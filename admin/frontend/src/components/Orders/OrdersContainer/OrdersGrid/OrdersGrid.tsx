import { FC } from "react";
import classNames from "classnames";

import OrderCard from "../OrderCard/OrderCard";
import { Order } from "../../../../interfaces/Order";

import styles from "./OrdersGrid.module.css";

interface OrdersGridProps {
  orders: Order[];
}

const OrdersGrid: FC<OrdersGridProps> = ({ orders }) => {
  return (
    <div className={classNames(styles["orders_container_grid"])}>
      {orders.map((order, idx) => (
        <OrderCard key={`order-${idx}`} order={order} />
      ))}
    </div>
  );
};

export default OrdersGrid;
