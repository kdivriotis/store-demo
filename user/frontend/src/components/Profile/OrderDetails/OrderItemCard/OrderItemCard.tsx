import { FC, useMemo } from "react";
import classNames from "classnames";

import { numberToString, round } from "../../../../utils";

import { OrderItem } from "../../../../interfaces/Order";

import styles from "./OrderItemCard.module.css";

interface OrderItemCardProps {
  item: OrderItem;
}

const OrderItemCard: FC<OrderItemCardProps> = ({ item }) => {
  const { productName, quantity, price } = item;

  const totalPrice: string = useMemo(() => {
    const total = quantity * +price;
    return numberToString(round(total, 2), 2);
  }, [quantity, price]);

  return (
    <li className={classNames(styles["order-item"])}>
      <div className={classNames(styles["order-item_details"])}>
        <p>{quantity}x</p>
        <h3>{productName}</h3>
      </div>
      <div className={classNames(styles["order-item_price"])}>
        <div className={classNames(styles["order-item_details"])}>
          <h4>Τιμή:</h4>
          <p>{totalPrice} €</p>
        </div>
        <div className={classNames(styles["order-item_details"])}>
          <h4>Τιμή μονάδας:</h4>
          <p>{price} €</p>
        </div>
      </div>
    </li>
  );
};

export default OrderItemCard;
