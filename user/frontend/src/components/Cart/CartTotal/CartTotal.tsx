import { FC, useMemo } from "react";
import classNames from "classnames";

import { numberToString, round } from "../../../utils";

import styles from "./CartTotal.module.css";

interface CartProduct {
  id: number;
  name: string;
  price: number;
  imageUrl: string | undefined | null;
  quantity: number;
}

interface CartTotalProps {
  products: CartProduct[];
}

const CartTotal: FC<CartTotalProps> = ({ products }) => {
  const totalPrice = useMemo(() => {
    const cartTotalPrice = products.reduce(
      (total, item) => total + item.quantity * +item.price,
      0.0
    );
    return numberToString(round(cartTotalPrice, 2), 2);
  }, [products]);

  return (
    <section id="cart-total">
      <div className={styles["cart-total"]}>
        <h1 className="header-base">Σύνολο Παραγγελίας:</h1>
        <h4 className="text-base">{totalPrice} €</h4>
      </div>
    </section>
  );
};

export default CartTotal;
