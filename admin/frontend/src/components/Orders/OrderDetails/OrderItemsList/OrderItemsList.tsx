import { FC } from "react";
import classNames from "classnames";

import { OrderItem } from "../../../../interfaces/Order";
import OrderItemCard from "../OrderItemCard/OrderItemCard";

import styles from "./OrderItemsList.module.css";

interface OrderItemsListProps {
  items: OrderItem[];
}

const OrderItemsList: FC<OrderItemsListProps> = ({ items }) => {
  return (
    <section id="order-items" className={classNames(styles["order-items"])}>
      <h1>Προϊόντα</h1>
      {!items || items.length === 0 ? (
        <p className="text-error">Δε βρέθηκαν προϊόντα</p>
      ) : (
        <ul>
          {items.map((item) => (
            <OrderItemCard key={item.productName} item={item} />
          ))}
        </ul>
      )}
    </section>
  );
};

export default OrderItemsList;
