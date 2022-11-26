import {
  FC,
  useContext,
  useState,
  useEffect,
  useMemo,
  ChangeEvent,
  FocusEvent,
} from "react";
import classNames from "classnames";

import { numberToString, round } from "../../../utils";

import { CartContext } from "../../../context";
import { CartContextType } from "../../../interfaces/CartContext";

import { CartProduct } from "../../../interfaces/Product";

import { ImageSlider } from "../..";

import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: CartProduct;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const {
    getQuantity,
    increaseQuantity,
    decreaseQuantity,
    changeQuantity,
    removeFromCart,
  } = useContext(CartContext) as CartContextType;

  const quantity = getQuantity(product.id);
  const [currentQuantity, setCurrentQuantity] = useState<string>(`${quantity}`);
  useEffect(() => setCurrentQuantity(`${quantity}`), [quantity]);

  const quantityBlurHandler = (event: FocusEvent<HTMLInputElement>) => {
    const actQuantity = parseInt(currentQuantity);
    if (isNaN(actQuantity)) setCurrentQuantity(`${quantity}`);
    else changeQuantity(product.id, actQuantity);
  };

  const totalPrice = useMemo(
    () => numberToString(round(product.quantity * +product.price, 2), 2),
    [product.price, product.quantity]
  );

  const quantityChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentQuantity(event.target.value);
  };

  return (
    <section id={product.name} className={classNames(styles["product-card"])}>
      <div className={classNames(styles["product-card_content"])}>
        {/* Image & Name */}
        <div>
          {product.imageUrl && (
            <div
              className={classNames(styles["product-card_image"])}
              aria-label={`Εικόνα για το προϊόν ${product.name}`}
            >
              <ImageSlider
                images={[{ url: product.imageUrl, title: product.name }]}
              />
            </div>
          )}
          <p
            className={classNames(styles["product-card_name"])}
            aria-label="Όνομα Προϊόντος"
          >
            {product.name}
          </p>
        </div>
        {/* Quantity & Price */}
        <div>
          <div className={classNames(styles["product-card_cart-actions"])}>
            <button
              onClick={() => decreaseQuantity(product.id)}
              aria-label="Μείωση Ποσότητας"
            >
              -
            </button>
            <input
              aria-label="Τρέχουσα Ποσότητα"
              id={`${product.name}-quantity`}
              type="number"
              step={1}
              min={0}
              max={999}
              maxLength={3}
              value={currentQuantity}
              onChange={quantityChangeHandler}
              onBlur={quantityBlurHandler}
            />
            <button
              onClick={() => increaseQuantity(product.id)}
              aria-label="Αύξηση Ποσότητας"
            >
              +
            </button>
          </div>
          <p
            className={classNames(styles["product-card_price"])}
            aria-label="Συνολική Τιμή Προϊόντος"
          >
            {totalPrice} €
          </p>
        </div>
      </div>
      <button
        className={classNames(styles["product-card_delete-btn"])}
        onClick={() => removeFromCart(product.id)}
        aria-label="Αφαίρεση προϊόντος απ'το καλάθι"
      >
        x
      </button>
    </section>
  );
};

export default ProductCard;
