import { FC, useContext } from "react";

import { CartContext } from "../../../context";
import { CartContextType } from "../../../interfaces/CartContext";

import styles from "./CartHeader.module.css";

const CartHeader: FC = () => {
  const { totalItems } = useContext(CartContext) as CartContextType;

  return (
    <header>
      <div className={styles["cart-header"]}>
        <h1 className="header-base">Καλάθι Αγορών</h1>
        <h4 className="text-base">{totalItems} προϊόντα</h4>
      </div>
      <hr className="primary-divider" />
    </header>
  );
};

export default CartHeader;
